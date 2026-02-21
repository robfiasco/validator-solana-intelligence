package app.validator.intelligence;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(NativeIntentPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
