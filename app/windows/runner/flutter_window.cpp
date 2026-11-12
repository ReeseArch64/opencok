#include "flutter_window.h"

#include <flutter/standard_method_codec.h>
#include <optional>

#include "flutter/generated_plugin_registrant.h"

FlutterWindow::FlutterWindow(const flutter::DartProject &project)
    : project_(project) {}

FlutterWindow::~FlutterWindow() {}

bool FlutterWindow::OnCreate() {
  if (!Win32Window::OnCreate()) {
    return false;
  }

  RECT frame = GetClientArea();

  flutter_controller_ = std::make_unique<flutter::FlutterViewController>(
      frame.right - frame.left, frame.bottom - frame.top, project_);

  if (!flutter_controller_->engine() || !flutter_controller_->view()) {
    return false;
  }
  RegisterPlugins(flutter_controller_->engine());
  security_channel_ =
      std::make_unique<flutter::MethodChannel<flutter::EncodableValue>>(
          flutter_controller_->engine()->messenger(),
          "org.opencok/device_security",
          &flutter::StandardMethodCodec::GetInstance());
  security_channel_->SetMethodCallHandler([](const auto &call, auto result) {
    if (call.method_name() != "check") {
      result->NotImplemented();
      return;
    }
    HANDLE token = nullptr;
    if (!OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY, &token)) {
      result->Error("security_unavailable", "Cannot read process token");
      return;
    }
    TOKEN_ELEVATION elevation = {};
    DWORD bytes = 0;
    const BOOL token_ok = GetTokenInformation(token, TokenElevation, &elevation,
                                              sizeof(elevation), &bytes);
    CloseHandle(token);
    if (!token_ok) {
      result->Error("security_unavailable", "Cannot read process elevation");
      return;
    }
    DWORD developer_mode = 0;
    DWORD size = sizeof(developer_mode);
    const LSTATUS registry_status = RegGetValueW(
        HKEY_LOCAL_MACHINE,
        L"SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\AppModelUnlock",
        L"AllowDevelopmentWithoutDevLicense",
        RRF_RT_REG_DWORD | RRF_SUBKEY_WOW6464KEY, nullptr, &developer_mode,
        &size);
    if (registry_status != ERROR_SUCCESS &&
        registry_status != ERROR_FILE_NOT_FOUND &&
        registry_status != ERROR_PATH_NOT_FOUND) {
      result->Error("security_unavailable", "Cannot read developer mode");
      return;
    }
    using flutter::EncodableValue;
    result->Success(EncodableValue(flutter::EncodableMap{
        {EncodableValue("privileged"),
         EncodableValue(elevation.TokenIsElevated != 0)},
        {EncodableValue("developerMode"),
         EncodableValue(registry_status == ERROR_SUCCESS &&
                        developer_mode != 0)},
        {EncodableValue("debuggerAttached"),
         EncodableValue(IsDebuggerPresent() != FALSE)},
    }));
  });
  SetChildContent(flutter_controller_->view()->GetNativeWindow());

  flutter_controller_->engine()->SetNextFrameCallback([&]() { this->Show(); });

  flutter_controller_->ForceRedraw();

  return true;
}

void FlutterWindow::OnDestroy() {
  security_channel_ = nullptr;
  if (flutter_controller_) {
    flutter_controller_ = nullptr;
  }

  Win32Window::OnDestroy();
}

LRESULT
FlutterWindow::MessageHandler(HWND hwnd, UINT const message,
                              WPARAM const wparam,
                              LPARAM const lparam) noexcept {

  if (flutter_controller_) {
    std::optional<LRESULT> result =
        flutter_controller_->HandleTopLevelWindowProc(hwnd, message, wparam,
                                                      lparam);
    if (result) {
      return *result;
    }
  }

  switch (message) {
  case WM_FONTCHANGE:
    flutter_controller_->engine()->ReloadSystemFonts();
    break;
  }

  return Win32Window::MessageHandler(hwnd, message, wparam, lparam);
}
