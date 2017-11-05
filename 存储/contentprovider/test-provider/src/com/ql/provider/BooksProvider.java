package com.ql.provider;

import android.content.ContentProvider;
import android.content.ContentUris;
import android.content.ContentValues;
import android.content.Context;
import android.content.UriMatcher;
import android.database.Cursor;
import android.database.SQLException;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.database.sqlite.SQLiteQueryBuilder;
import android.net.Uri;
import android.text.TextUtils;
import android.util.Log;

public class BooksProvider extends ContentProvider {
    public static final String AUTHORITY = "com.ql.provider.booksprovider";
    public static final Uri CONTENT_URI = Uri.parse("content://"
            + AUTHORITY + "/books");

    private static final UriMatcher URI_MATCHER;
    private static final int BOOKS = 1;
    private static final int BOOK_ID = 2;

    static {
        URI_MATCHER = new UriMatcher(UriMatcher.NO_MATCH);
        URI_MATCHER.addURI(AUTHORITY, "books", BOOKS);
        //其中#通配了 任何数字，而*通配了任何 字符
        URI_MATCHER.addURI(AUTHORITY, "books/#", BOOK_ID);
    }

    //数据库相关
    private SQLiteDatabase booksDB;
    private static final String DATABASE_NAME = "Books";
    private static final String TABLE_NAME = "titles";
    private static final int DATABASE_VERSION = 1;
    private static final String DATABASE_CREATE = "create table "
            + TABLE_NAME + " (_id integer primary key autoincrement, "
            + "title text not null, isbn text not null);";
    //表字段
    public static final String _ID = "_id";
    public static final String TITLE = "title";
    public static final String ISBN = "isbn";

    @Override
    public boolean onCreate() {
        Context context = getContext();
        DatabaseHelper dbHelper = new DatabaseHelper(context);
        booksDB = dbHelper.getWritableDatabase();
        return (booksDB == null) ? false : true;
    }

    private static class DatabaseHelper extends SQLiteOpenHelper {
        DatabaseHelper(Context context) {
            super(context, DATABASE_NAME, null, DATABASE_VERSION);
        }

        @Override
        public void onCreate(SQLiteDatabase db) {
            db.execSQL(DATABASE_CREATE);
        }

        @Override
        public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
            Log.w("Content provider database",
                    "Upgrading database from version " + oldVersion + " to "
                            + newVersion + ", which will destroy all old data");
            db.execSQL("DROP TABLE IF EXISTS titles");
            onCreate(db);
        }
    }

    @Override
    public String getType(Uri uri) {
        switch (URI_MATCHER.match(uri)) {
            //---get all books---
            case BOOKS:
                return "vnd.android.cursor.dir/vnd.learn2develop.books ";
            //---get a particular book---
            case BOOK_ID:
                return "vnd.android.cursor.item/vnd.learn2develop.books ";
            default:
                throw new IllegalArgumentException("Unsupported URI: " + uri);
        }
    }

    @Override
    public Cursor query(Uri uri, String[] projection, String selection,
                        String[] selectionArgs, String sortOrder) {
        SQLiteQueryBuilder sqlBuilder = new SQLiteQueryBuilder();
        sqlBuilder.setTables(TABLE_NAME);

        if (URI_MATCHER.match(uri) == BOOK_ID)
            //---if getting a particular book---
            //因为在book_id的情况下，path segments总共有2个，第1个为id
            sqlBuilder.appendWhere(_ID + " = " + uri.getPathSegments().get(1));

        if (sortOrder == null || sortOrder == "")
            sortOrder = TITLE;

        Cursor c = sqlBuilder.query(booksDB, projection, selection,
                selectionArgs, null, null, sortOrder);

        //---register to watch a content URI for changes---
        c.setNotificationUri(getContext().getContentResolver(), uri);
        return c;
    }

    @Override
    public Uri insert(Uri uri, ContentValues values) {
        //---add a new book---
        long rowID = booksDB.insert(TABLE_NAME, "", values);

        //---if added successfully---
        if (rowID > 0) {
            Uri _uri = ContentUris.withAppendedId(CONTENT_URI, rowID);
            getContext().getContentResolver().notifyChange(_uri, null);
            return _uri;
        }

        throw new SQLException("Failed to insert row into " + uri);
    }

    @Override
    public int delete(Uri uri, String selection, String[] selectionArgs) {
        int count = 0;
        switch (URI_MATCHER.match(uri)) {
            case BOOKS:
                count = booksDB.delete(TABLE_NAME, selection, selectionArgs);

                break;

            case BOOK_ID:
                String id = uri.getPathSegments().get(1);
                count = booksDB.delete(TABLE_NAME, _ID + " = " + id
                                + (!TextUtils.isEmpty(selection) ? " AND (" + selection + ')' : ""),
                        selectionArgs);
                break;

            default:
                throw new IllegalArgumentException("Unknown URI " + uri);

        }

        getContext().getContentResolver().notifyChange(uri, null);

        return count;
    }

    @Override
    public int update(Uri uri, ContentValues values, String selection,
                      String[] selectionArgs) {
        // TODO Auto-generated method stub
        return 0;
    }
}
