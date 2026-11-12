package org.opencok.opencok

import android.graphics.Color
import android.os.Bundle
import android.view.Gravity
import android.widget.FrameLayout
import android.widget.ImageView
import io.flutter.embedding.android.FlutterActivity
import kotlin.math.min

class MainActivity : FlutterActivity() {
    private var launchOverlay: FrameLayout? = null

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        val overlay = FrameLayout(this).apply { setBackgroundColor(Color.BLACK) }
        val logo = ImageView(this).apply {
            setImageResource(org.opencok.opencok.R.drawable.splash_logo)
            scaleType = ImageView.ScaleType.FIT_CENTER
            contentDescription = "OpenCoK"
        }
        overlay.addView(logo)
        addContentView(overlay, FrameLayout.LayoutParams(-1, -1))
        launchOverlay = overlay
        overlay.addOnLayoutChangeListener { _, _, _, _, _, _, _, _, _ ->
            val density = resources.displayMetrics.density
            val width = overlay.width / density
            val height = overlay.height / density
            val landscape = width > height
            val panelWidth = if (landscape) min(480f, width * 0.45f) else min(440f, width)
            val logoWidth = min(min(444f, width * 0.7f), panelWidth - 64f)
            val cutoutTop = if (android.os.Build.VERSION.SDK_INT >= 28) {
                overlay.rootWindowInsets?.displayCutout?.safeInsetTop ?: 0
            } else 0
            val params = FrameLayout.LayoutParams(
                (logoWidth * density).toInt(),
                (logoWidth * 805f / 1954f * density).toInt(),
                Gravity.TOP or if (landscape) Gravity.RIGHT else Gravity.CENTER_HORIZONTAL,
            )
            params.topMargin = cutoutTop + ((48f + (panelWidth - 64f) * 32f / 378f) * density).toInt()
            if (landscape) params.rightMargin = ((panelWidth - logoWidth) / 2f * density).toInt()
            if (logo.layoutParams.width != params.width ||
                logo.layoutParams.height != params.height ||
                (logo.layoutParams as? FrameLayout.LayoutParams)?.topMargin != params.topMargin) {
                logo.layoutParams = params
            }
        }
    }

    override fun onFlutterUiDisplayed() {
        super.onFlutterUiDisplayed()
        launchOverlay?.let { (it.parent as? android.view.ViewGroup)?.removeView(it) }
        launchOverlay = null
    }
}
