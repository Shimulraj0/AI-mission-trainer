import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import sharp from 'sharp';
import crypto from 'crypto';

function run(cmd, opts = {}) {
  console.log(`[EXEC] ${cmd}`);
  return execSync(cmd, { stdio: 'inherit', ...opts });
}

async function buildApk() {
  console.log('🚀 Starting Junior Astronaut Mission Trainer Android APK Build Pipeline...');

  // 1. Build web application
  console.log('📦 Step 1: Building production web bundle with Vite...');
  run('npm run build');

  const rootDir = process.cwd();
  const androidDir = path.join(rootDir, 'android');
  const genDir = path.join(androidDir, 'gen');
  const binDir = path.join(androidDir, 'bin');
  const classesDir = path.join(binDir, 'classes');
  const assetsDir = path.join(androidDir, 'assets');
  const resDir = path.join(androidDir, 'res');
  const srcDir = path.join(androidDir, 'src/org/juniorastronaut/trainer');

  // Clean / recreate directories
  fs.rmSync(androidDir, { recursive: true, force: true });
  fs.mkdirSync(genDir, { recursive: true });
  fs.mkdirSync(classesDir, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });
  fs.mkdirSync(path.join(resDir, 'values'), { recursive: true });
  fs.mkdirSync(path.join(resDir, 'layout'), { recursive: true });
  fs.mkdirSync(srcDir, { recursive: true });

  // 2. Generate Launcher Icons for Android mipmap/drawable densities
  console.log('🎨 Step 2: Generating Android launcher icons...');
  const iconSource = path.join(rootDir, 'public/icon-512.png');
  const iconBuffer = fs.readFileSync(iconSource);

  const densities = [
    { name: 'drawable-mdpi', size: 48 },
    { name: 'drawable-hdpi', size: 72 },
    { name: 'drawable-xhdpi', size: 96 },
    { name: 'drawable-xxhdpi', size: 144 },
    { name: 'drawable-xxxhdpi', size: 192 },
  ];

  for (const d of densities) {
    const dir = path.join(resDir, d.name);
    fs.mkdirSync(dir, { recursive: true });
    await sharp(iconBuffer)
      .resize(d.size, d.size)
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));
  }

  // Also default drawable
  const defDrawableDir = path.join(resDir, 'drawable');
  fs.mkdirSync(defDrawableDir, { recursive: true });
  await sharp(iconBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join(defDrawableDir, 'ic_launcher.png'));

  // 3. AndroidManifest.xml
  console.log('📄 Step 3: Generating AndroidManifest.xml...');
  const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="org.juniorastronaut.trainer"
    android:versionCode="100"
    android:versionName="4.2.0">

    <uses-sdk
        android:minSdkVersion="21"
        android:targetSdkVersion="33" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.WAKE_LOCK" />

    <application
        android:label="@string/app_name"
        android:icon="@drawable/ic_launcher"
        android:theme="@style/Theme.JuniorAstronaut"
        android:hardwareAccelerated="true"
        android:usesCleartextTraffic="true"
        android:allowBackup="true"
        android:supportsRtl="true">

        <activity
            android:name=".MainActivity"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden"
            android:screenOrientation="sensor"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  fs.writeFileSync(path.join(androidDir, 'AndroidManifest.xml'), manifestContent);

  // 4. strings.xml & styles.xml
  console.log('📝 Step 4: Generating XML resources...');
  const stringsContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Junior Astronaut Mission Trainer</string>
    <string name="app_name_bn">জুনিয়র নভোচারী মিশন ট্রেইনার</string>
</resources>`;
  fs.writeFileSync(path.join(resDir, 'values/strings.xml'), stringsContent);

  const stylesContent = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.JuniorAstronaut" parent="@android:style/Theme.NoTitleBar.Fullscreen">
        <item name="android:windowBackground">@android:color/black</item>
        <item name="android:windowNoTitle">true</item>
        <item name="android:windowFullscreen">true</item>
        <item name="android:windowContentOverlay">@null</item>
    </style>
</resources>`;
  fs.writeFileSync(path.join(resDir, 'values/styles.xml'), stylesContent);

  // 5. activity_main.xml layout
  const layoutContent = `<?xml version="1.0" encoding="utf-8"?>
<FrameLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#060913">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />
</FrameLayout>`;
  fs.writeFileSync(path.join(resDir, 'layout/activity_main.xml'), layoutContent);

  // 6. MainActivity.java
  console.log('☕ Step 5: Generating Native Android Activity (Java)...');
  const javaContent = `package org.juniorastronaut.trainer;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.view.Window;
import android.view.WindowManager;
import android.view.View;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.graphics.Color;

public class MainActivity extends Activity {
    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Hardware acceleration and fullscreen setup
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED,
            WindowManager.LayoutParams.FLAG_HARDWARE_ACCELERATED
        );
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        );

        setContentView(R.layout.activity_main);

        mWebView = (WebView) findViewById(R.id.webview);
        mWebView.setBackgroundColor(Color.parseColor("#060913"));

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);
        settings.setSupportZoom(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("file://")) {
                    return false;
                }
                return true;
            }
        });

        mWebView.setWebChromeClient(new WebChromeClient());

        // Load offline packaged application from android assets
        mWebView.loadUrl("file:///android_asset/index.html");

        hideSystemUI();
    }

    private void hideSystemUI() {
        View decorView = getWindow().getDecorView();
        decorView.setSystemUiVisibility(
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
            | View.SYSTEM_UI_FLAG_FULLSCREEN
        );
    }

    @Override
    public void onWindowFocusChanged(boolean hasFocus) {
        super.onWindowFocusChanged(hasFocus);
        if (hasFocus) {
            hideSystemUI();
        }
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`;
  fs.writeFileSync(path.join(srcDir, 'MainActivity.java'), javaContent);

  // 7. Copy web bundle into assets
  console.log('📂 Step 6: Copying dist/ into Android assets...');
  const distDir = path.join(rootDir, 'dist');
  fs.cpSync(distDir, assetsDir, { recursive: true });

  // 8. Generate R.java with aapt
  console.log('⚙️ Step 7: Compiling resources with aapt...');
  const androidJar = '/usr/lib/android-sdk/platforms/android-23/android.jar';
  run(`aapt package -f -m -J "${genDir}" -M "${path.join(androidDir, 'AndroidManifest.xml')}" -S "${resDir}" -I "${androidJar}"`);

  // 9. Compile Java sources with javac
  console.log('☕ Step 8: Compiling Java classes with javac...');
  run(`javac -source 8 -target 8 -cp "${androidJar}" -d "${classesDir}" "${path.join(srcDir, 'MainActivity.java')}" "${path.join(genDir, 'org/juniorastronaut/trainer/R.java')}"`);

  // 10. Generate classes.dex with dx
  console.log('⚡ Step 9: Producing classes.dex Dalvik bytecode with dx...');
  const dexFile = path.join(binDir, 'classes.dex');
  run(`dx --dex --output="${dexFile}" "${classesDir}"`);

  // 11. Package initial APK with aapt
  console.log('📦 Step 10: Packaging APK archive with aapt...');
  const unalignedApk = path.join(binDir, 'app-unaligned.apk');
  run(`aapt package -f -M "${path.join(androidDir, 'AndroidManifest.xml')}" -S "${resDir}" -A "${assetsDir}" -I "${androidJar}" -F "${unalignedApk}"`);

  // Add classes.dex into unaligned apk root
  console.log('📥 Step 11: Adding classes.dex to APK root...');
  run(`cd "${binDir}" && aapt add app-unaligned.apk classes.dex`);

  // 12. Align with zipalign (4-byte boundary)
  console.log('📐 Step 12: Aligning APK with zipalign (4-byte alignment)...');
  const alignedApk = path.join(binDir, 'app-aligned.apk');
  run(`zipalign -f -p 4 "${unalignedApk}" "${alignedApk}"`);

  // 13. Create Keystore if needed and Sign with apksigner
  console.log('🔐 Step 13: Signing APK with release keystore (v1, v2, v3 schemes)...');
  const keystoreFile = path.join(rootDir, 'release.keystore');
  if (!fs.existsSync(keystoreFile)) {
    console.log('Generating production release keystore...');
    run(`keytool -genkeypair -v -keystore "${keystoreFile}" -alias jr-astronaut -keyalg RSA -keysize 2048 -validity 10000 -storepass astronaut2026 -keypass astronaut2026 -dname "CN=Junior Astronaut Mission Trainer, OU=Flight Academy, O=SPARRSO-NASA, L=Dhaka, ST=Dhaka, C=BD"`);
  }

  const outputApk = path.join(rootDir, 'public/junior-astronaut-mission-trainer.apk');
  run(`apksigner sign --ks "${keystoreFile}" --ks-pass pass:astronaut2026 --ks-key-alias jr-astronaut --key-pass pass:astronaut2026 --out "${outputApk}" "${alignedApk}"`);

  // Also copy to dist/ if dist exists
  if (fs.existsSync(distDir)) {
    fs.copyFileSync(outputApk, path.join(distDir, 'junior-astronaut-mission-trainer.apk'));
  }

  // 14. Verify APK signature and output details
  console.log('✅ Step 14: Verifying APK integrity and signature...');
  run(`apksigner verify --verbose "${outputApk}"`);

  const stats = fs.statSync(outputApk);
  const apkSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  const fileBuffer = fs.readFileSync(outputApk);
  const sha256 = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // Also write an apk-metadata.json in public so the UI can fetch live metadata
  const meta = {
    fileName: 'junior-astronaut-mission-trainer.apk',
    version: '4.2.0',
    versionCode: 100,
    packageName: 'org.juniorastronaut.trainer',
    appName: 'Junior Astronaut Mission Trainer',
    appNameBn: 'জুনিয়র নভোচারী মিশন ট্রেইনার',
    fileSizeMB: apkSizeMB,
    fileSizeBytes: stats.size,
    sha256: sha256,
    minSdkVersion: 21,
    targetSdkVersion: 33,
    builtAt: new Date().toISOString(),
    features: [
      'Full offline gameplay support (React 19 + Vite bundled)',
      'Hardware-accelerated immersive fullscreen WebView shell',
      'Cryptographic TEE Enclave verification engine',
      'Integrated NASA API datasets and Bangladesh ground stations',
      'Dynamic OpenCode CLI color themes (24 variations)',
      'Full bilingual localization (English + Bengali / বাংলা)'
    ]
  };

  fs.writeFileSync(path.join(rootDir, 'public/apk-info.json'), JSON.stringify(meta, null, 2));
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'apk-info.json'), JSON.stringify(meta, null, 2));
  }

  console.log('🎉 APK BUILD SUCCESSFUL!');
  console.log(`📦 File: ${outputApk}`);
  console.log(`📏 Size: ${apkSizeMB} MB (${stats.size} bytes)`);
  console.log(`🔑 SHA-256: ${sha256}`);
}

buildApk().catch((err) => {
  console.error('❌ Failed to build APK:', err);
  process.exit(1);
});
