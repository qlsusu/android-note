package com.ql.provider;

import android.app.Activity;
import android.content.ContentResolver;
import android.database.Cursor;
import android.net.Uri;
import android.os.Bundle;
import android.util.Log;

public class Test extends Activity
{
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);

        ContentResolver resolver = getContentResolver();
        Log.i("ql", "oncreate");

        Uri uri = Uri
            .parse("content://com.ql.provider.booksprovider/ql/books/122234");

        Cursor c = resolver.query(uri, null, null, null, null);
    }
}
