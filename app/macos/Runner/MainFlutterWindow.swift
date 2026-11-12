import Cocoa
import FlutterMacOS
import Darwin

class MainFlutterWindow: NSWindow {
  private var securityChannel: FlutterMethodChannel?

  override func awakeFromNib() {
    let flutterViewController = FlutterViewController()
    let windowFrame = self.frame
    self.contentViewController = flutterViewController
    self.setFrame(windowFrame, display: true)

    RegisterGeneratedPlugins(registry: flutterViewController)

    securityChannel = FlutterMethodChannel(
      name: "org.opencok/device_security",
      binaryMessenger: flutterViewController.engine.binaryMessenger
    )
    securityChannel?.setMethodCallHandler { call, result in
      guard call.method == "check" else {
        result(FlutterMethodNotImplemented)
        return
      }
      var info = kinfo_proc()
      var size = MemoryLayout<kinfo_proc>.size
      var mib: [Int32] = [CTL_KERN, KERN_PROC, KERN_PROC_PID, getpid()]
      let count = u_int(mib.count)
      guard sysctl(&mib, count, &info, &size, nil, 0) == 0 else {
        result(FlutterError(code: "security_unavailable",
                            message: "Cannot read process security status",
                            details: nil))
        return
      }
      result([
        "privileged": getuid() == 0 || geteuid() == 0,

        "developerMode": false,
        "debuggerAttached": (info.kp_proc.p_flag & P_TRACED) != 0,
      ])
    }

    super.awakeFromNib()
  }
}
