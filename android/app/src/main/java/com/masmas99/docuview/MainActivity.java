package com.masmas99.docuview;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.util.Base64;
import android.webkit.WebView;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    private final Handler handler = new Handler();

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        handlePdfIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handlePdfIntent(intent);
    }

    private void handlePdfIntent(Intent intent) {
        Uri uri = null;
        if (Intent.ACTION_SEND.equals(intent.getAction())) {
            uri = intent.getParcelableExtra(Intent.EXTRA_STREAM);
        } else if (Intent.ACTION_VIEW.equals(intent.getAction())) {
            uri = intent.getData();
        }

        if (uri == null)
            return;

        try (InputStream input = getContentResolver().openInputStream(uri)) {
            if (input == null)
                return;

            ByteArrayOutputStream output = new ByteArrayOutputStream();
            byte[] buffer = new byte[8192];
            int length;
            while ((length = input.read(buffer)) != -1) {
                output.write(buffer, 0, length);
            }

            String base64 = Base64.encodeToString(output.toByteArray(), Base64.NO_WRAP);
            dispatchPdfToWebView(base64);
        } catch (Exception error) {
            error.printStackTrace();
        }
    }

    private void dispatchPdfToWebView(String base64) {
        handler.postDelayed(() -> {
            WebView webView = getBridge().getWebView();
            String script = "window.dispatchEvent(new CustomEvent('native-pdf', { detail: { base64: '"
                    + base64 + "' } }));";
            webView.evaluateJavascript(script, null);
        }, 1500);
    }
}
