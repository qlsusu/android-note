// IMyLogic.aidl
package com.ql.bind;

// Declare any non-default types here with import statements

//需要进行import，即使IMyLogic 和 IMyLogicCallback在同一个包下
import com.ql.bind.IMyLogicCallback;
import com.ql.bind.bean.MyParcel;

interface IMyLogic {
//    /**
//     * Demonstrates some basic types that you can use as parameters
//     * and return values in AIDL.
//     */
//    void basicTypes(int anInt, long aLong, boolean aBoolean, float aFloat,
//            double aDouble, String aString);

    int add(int a,int b, INormalLogicCallback callback, in MyParcel inParcel, out MyParcel outParcel, inout MyParcel inOutParcel);
}
