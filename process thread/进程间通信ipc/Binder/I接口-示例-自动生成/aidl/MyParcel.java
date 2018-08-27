package com.ql.bind.bean;

import android.os.Parcel;
import android.os.Parcelable;

/**
 * Created by qlong on 17/7/25.
 */

public class MyParcel implements Parcelable {
    private String name;
    private int age;


    @Override
    public int describeContents() {
        return 0;
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(this.name);
        dest.writeInt(this.age);
    }

    public MyParcel() {
    }

    protected MyParcel(Parcel in) {
        this.name = in.readString();
        this.age = in.readInt();
    }

    public static final Creator<MyParcel> CREATOR = new Creator<MyParcel>() {
        @Override
        public MyParcel createFromParcel(Parcel source) {
            return new MyParcel(source);
        }

        @Override
        public MyParcel[] newArray(int size) {
            return new MyParcel[size];
        }
    };
}
