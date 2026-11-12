#include "my_application.h"

#include <flutter_linux/flutter_linux.h>
#include <unistd.h>

#include <fstream>
#include <string>
#ifdef GDK_WINDOWING_X11
#include <gdk/gdkx.h>
#endif

#include "flutter/generated_plugin_registrant.h"

struct _MyApplication {
  GtkApplication parent_instance;
  char **dart_entrypoint_arguments;
};

G_DEFINE_TYPE(MyApplication, my_application, GTK_TYPE_APPLICATION)

static void check_device_security(FlMethodChannel *, FlMethodCall *call,
                                  gpointer) {
  if (strcmp(fl_method_call_get_name(call), "check") != 0) {
    fl_method_call_respond_not_implemented(call, nullptr);
    return;
  }

  std::ifstream status("/proc/self/status");
  std::string key;
  int tracer_pid = -1;
  while (status >> key) {
    if (key == "TracerPid:") {
      status >> tracer_pid;
      break;
    }
    std::getline(status, key);
  }
  if (tracer_pid < 0) {
    fl_method_call_respond_error(call, "security_unavailable",
                                 "Cannot read process security status", nullptr,
                                 nullptr);
    return;
  }

  g_autoptr(FlValue) flags = fl_value_new_map();
  fl_value_set_string_take(flags, "privileged",
                           fl_value_new_bool(getuid() == 0 || geteuid() == 0));

  fl_value_set_string_take(flags, "developerMode", fl_value_new_bool(false));
  fl_value_set_string_take(flags, "debuggerAttached",
                           fl_value_new_bool(tracer_pid != 0));
  fl_method_call_respond_success(call, flags, nullptr);
}

static void first_frame_cb(MyApplication *self, FlView *view) {
  gtk_widget_show(gtk_widget_get_toplevel(GTK_WIDGET(view)));
}

static void my_application_activate(GApplication *application) {
  MyApplication *self = MY_APPLICATION(application);
  GtkWindow *window =
      GTK_WINDOW(gtk_application_window_new(GTK_APPLICATION(application)));

  gboolean use_header_bar = TRUE;
#ifdef GDK_WINDOWING_X11
  GdkScreen *screen = gtk_window_get_screen(window);
  if (GDK_IS_X11_SCREEN(screen)) {
    const gchar *wm_name = gdk_x11_screen_get_window_manager_name(screen);
    if (g_strcmp0(wm_name, "GNOME Shell") != 0) {
      use_header_bar = FALSE;
    }
  }
#endif
  if (use_header_bar) {
    GtkHeaderBar *header_bar = GTK_HEADER_BAR(gtk_header_bar_new());
    gtk_widget_show(GTK_WIDGET(header_bar));
    gtk_header_bar_set_title(header_bar, "OpenCoK");
    gtk_header_bar_set_show_close_button(header_bar, TRUE);
    gtk_window_set_titlebar(window, GTK_WIDGET(header_bar));
  } else {
    gtk_window_set_title(window, "OpenCoK");
  }

  gtk_window_set_default_size(window, 1280, 720);
  g_autofree gchar *executable = g_file_read_link("/proc/self/exe", nullptr);
  g_autofree gchar *bundle_dir = g_path_get_dirname(executable);
  g_autofree gchar *icon_path =
      g_build_filename(bundle_dir, "data", "app_icon.png", nullptr);
  gtk_window_set_icon_from_file(window, icon_path, nullptr);

  g_autoptr(FlDartProject) project = fl_dart_project_new();
  fl_dart_project_set_dart_entrypoint_arguments(
      project, self->dart_entrypoint_arguments);

  FlView *view = fl_view_new(project);
  g_autoptr(FlStandardMethodCodec) security_codec =
      fl_standard_method_codec_new();
  g_autoptr(FlMethodChannel) security_channel = fl_method_channel_new(
      fl_engine_get_binary_messenger(fl_view_get_engine(view)),
      "org.opencok/device_security", FL_METHOD_CODEC(security_codec));
  fl_method_channel_set_method_call_handler(
      security_channel, check_device_security, nullptr, nullptr);
  GdkRGBA background_color;

  gdk_rgba_parse(&background_color, "#000000");
  fl_view_set_background_color(view, &background_color);
  gtk_widget_show(GTK_WIDGET(view));
  gtk_container_add(GTK_CONTAINER(window), GTK_WIDGET(view));

  g_signal_connect_swapped(view, "first-frame", G_CALLBACK(first_frame_cb),
                           self);
  gtk_widget_realize(GTK_WIDGET(view));

  fl_register_plugins(FL_PLUGIN_REGISTRY(view));

  gtk_widget_grab_focus(GTK_WIDGET(view));
}

static gboolean my_application_local_command_line(GApplication *application,
                                                  gchar ***arguments,
                                                  int *exit_status) {
  MyApplication *self = MY_APPLICATION(application);

  self->dart_entrypoint_arguments = g_strdupv(*arguments + 1);

  g_autoptr(GError) error = nullptr;
  if (!g_application_register(application, nullptr, &error)) {
    g_warning("Failed to register: %s", error->message);
    *exit_status = 1;
    return TRUE;
  }

  g_application_activate(application);
  *exit_status = 0;

  return TRUE;
}

static void my_application_startup(GApplication *application) {

  G_APPLICATION_CLASS(my_application_parent_class)->startup(application);
}

static void my_application_shutdown(GApplication *application) {

  G_APPLICATION_CLASS(my_application_parent_class)->shutdown(application);
}

static void my_application_dispose(GObject *object) {
  MyApplication *self = MY_APPLICATION(object);
  g_clear_pointer(&self->dart_entrypoint_arguments, g_strfreev);
  G_OBJECT_CLASS(my_application_parent_class)->dispose(object);
}

static void my_application_class_init(MyApplicationClass *klass) {
  G_APPLICATION_CLASS(klass)->activate = my_application_activate;
  G_APPLICATION_CLASS(klass)->local_command_line =
      my_application_local_command_line;
  G_APPLICATION_CLASS(klass)->startup = my_application_startup;
  G_APPLICATION_CLASS(klass)->shutdown = my_application_shutdown;
  G_OBJECT_CLASS(klass)->dispose = my_application_dispose;
}

static void my_application_init(MyApplication *self) {}

MyApplication *my_application_new() {

  g_set_prgname(APPLICATION_ID);

  return MY_APPLICATION(g_object_new(my_application_get_type(),
                                     "application-id", APPLICATION_ID, "flags",
                                     G_APPLICATION_NON_UNIQUE, nullptr));
}
