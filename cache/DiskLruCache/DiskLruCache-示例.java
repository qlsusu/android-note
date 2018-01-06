package com.ql.disklrucache;

import java.io.File;
import java.io.IOException;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager.NameNotFoundException;
import android.os.Bundle;
import android.os.Environment;
import android.support.v7.app.AppCompatActivity;
import android.view.View;
import android.view.View.OnClickListener;

import com.jakewharton.disklrucache.DiskLruCache;
import com.jakewharton.disklrucache.DiskLruCache.Editor;
import com.jakewharton.disklrucache.DiskLruCache.Snapshot;

import okio.BufferedSink;
import okio.BufferedSource;
import okio.Okio;

public class MainActivity extends AppCompatActivity
{
    private class Cache
    {
        private final File dir = getCacheDir(getApplicationContext(), "disk");
        /**
         * 当之前 在appVersion为a的情况下，进行了操作<br>
         * 而现在appVersion变为b，则会删除 appVersion为a时的所有条目
         */
        private final int appVersion = getAppVersion(getApplicationContext());
        /**
         * 一个条目对应多少个文件
         */
        private final int valueCount = 2;
        /**
         * 缓存大小（byte为单位）
         */
        private final int maxSize = 1024 * 1024 * 10;

        /**
         * 选择cache的dir，来自 内置或者sdcard
         * 
         * @param context
         * @param uniqueName
         * @return
         */
        private File getCacheDir(Context context, String uniqueName)
        {
            String cachePath;
            if ((Environment.MEDIA_MOUNTED.equals(Environment.getExternalStorageState())
                || !Environment.isExternalStorageRemovable()) && context.getExternalCacheDir() != null)
            {
                cachePath = context.getExternalCacheDir().getPath();
            }
            else
            {
                cachePath = context.getCacheDir().getPath();
            }
            return new File(cachePath + File.separator + uniqueName + File.separator);
        }

        public int getAppVersion(Context context)
        {
            try
            {
                PackageInfo info = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
                return info.versionCode;
            }
            catch (NameNotFoundException e)
            {
                e.printStackTrace();
            }
            return 1;
        }

        private final String key = "mykey";

        /**
         * 其中的DiskLruCache源码来自：https://github.com/JakeWharton/DiskLruCache
         */
        private DiskLruCache cache;
        {
            try
            {
                cache = DiskLruCache.open(dir, appVersion, valueCount, maxSize);
            }
            catch (IOException e)
            {
                e.printStackTrace();
            }
        }

    }

    private Cache cache;

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        cache = new Cache();

        findViewById(R.id.write).setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                try
                {
                    //一个条目对应2个缓存文件
                    //需要每个文件都写入时，才能editor.commit
                    Editor editor = cache.cache.edit(cache.key);
                    BufferedSink sink = Okio.buffer(Okio.sink(editor.newOutputStream(0)));
                    sink.writeUtf8("head");
                    sink.flush();
                    sink.close();

                    sink = Okio.buffer(Okio.sink(editor.newOutputStream(1)));
                    sink.writeUtf8("content");
                    sink.flush();
                    sink.close();

                    editor.commit();

                    System.out.println("finish write to disklrucache");
                }
                catch (IOException e)
                {
                    e.printStackTrace();
                }
            }
        });

        findViewById(R.id.read).setOnClickListener(new OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                try
                {
                    Snapshot snapshot = cache.cache.get(cache.key);

                    BufferedSource source = Okio.buffer(Okio.source(snapshot.getInputStream(0)));
                    System.out.println(source.readUtf8Line());
                    source.close();

                    source = Okio.buffer(Okio.source(snapshot.getInputStream(1)));
                    System.out.println(source.readUtf8Line());
                    source.close();
                }
                catch (IOException e)
                {
                    e.printStackTrace();
                }
            }
        });
    }

    @Override
    protected void onPause()
    {
        super.onPause();
        try
        {
            cache.cache.flush();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }

    @Override
    protected void onDestroy()
    {
        super.onDestroy();
        try
        {
            cache.cache.close();
        }
        catch (IOException e)
        {
            e.printStackTrace();
        }
    }
}
