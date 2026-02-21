package app.validator.intelligence;

import android.content.Intent;
import android.net.Uri;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "NativeIntent")
public class NativeIntentPlugin extends Plugin {

    @PluginMethod
    public void openUrl(PluginCall call) {
        String urlStr = call.getString("url");
        if (urlStr == null) {
            call.reject("Must provide an url");
            return;
        }
        try {
            // Native fix for solana-wallet:// deep link intents that WebView aggressively blocks
            Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(urlStr));
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            getContext().startActivity(intent);
            call.resolve();
        } catch (Exception e) {
            call.reject("Error launching intent", e);
        }
    }
}
