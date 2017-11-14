/*
 * This file is auto-generated.  DO NOT MODIFY.
 * Original file: /Users/qlong/project-as/test/bind/src/main/aidl/com/ql/bind/IMyLogic.aidl
 */
package com.ql.bind;
// Declare any non-default types here with import statements

public interface IMyLogic extends android.os.IInterface {
    //I接口方法
    public int add(int a, int b, com.ql.bind.INormalLogicCallback callback, com.ql.bind.bean.MyParcel inParcel, com.ql.bind.bean.MyParcel outParcel, com.ql.bind.bean.MyParcel inOutParcel) throws android.os.RemoteException;

    /**
     * Local-side IPC implementation stub class.
     */
    public static abstract class Stub extends android.os.Binder implements com.ql.bind.IMyLogic {
        //I接口标识
        private static final java.lang.String DESCRIPTOR = "com.ql.bind.IMyLogic";

        //方法标识
        static final int TRANSACTION_add = (android.os.IBinder.FIRST_CALL_TRANSACTION + 0);

        //我这个binder对应了I接口
        /**
         * Construct the stub at attach it to the interface.
         */
        public Stub() {
            this.attachInterface(this, DESCRIPTOR);
        }

        //------------------------------------client的使用
        /**
         * 该方法在client中使用，用于产生proxy
         * Cast an IBinder object into an com.ql.bind.IMyLogic interface,
         * generating a proxy if needed.
         */
        public static com.ql.bind.IMyLogic asInterface(android.os.IBinder obj) {
            if ((obj == null)) {
                return null;
            }

            //如果是 bind方(client) 和 被bind方(server) 在同一个进程中，那么直接返回 i接口.stub对象
            android.os.IInterface iin = obj.queryLocalInterface(DESCRIPTOR);
            if (((iin != null) && (iin instanceof com.ql.bind.IMyLogic))) {
                return ((com.ql.bind.IMyLogic) iin);
            }

            //产生I接口的代理对象
            return new com.ql.bind.IMyLogic.Stub.Proxy(obj);
        }

        //--------Proxy的定义（往往在stub类中 定义，如：ActivityManagerNative定义了ActivityManagerProxy）
        private static class Proxy implements com.ql.bind.IMyLogic {
            //其 对应 真实的i接口.stub对象 的remote版本：
            //stub对象被称为 native（如：IActivityManager的stub的类名为：ActivityManagerNative），则该ibinder对象被称为 remote
            //这两个binder对象代表：在不同进程的 "同一个"对象
            private android.os.IBinder mRemote;

            Proxy(android.os.IBinder remote) {
                mRemote = remote;
            }

            @Override
            public android.os.IBinder asBinder() {
                return mRemote;
            }

            public java.lang.String getInterfaceDescriptor() {
                return DESCRIPTOR;
            }

            @Override
            public int add(int a, int b, com.ql.bind.INormalLogicCallback callback, com.ql.bind.bean.MyParcel inParcel, com.ql.bind.bean.MyParcel outParcel, com.ql.bind.bean.MyParcel inOutParcel) throws android.os.RemoteException {
                android.os.Parcel _data = android.os.Parcel.obtain();
                android.os.Parcel _reply = android.os.Parcel.obtain();
                int _result;
                try {
                    //我要使用I接口
                    _data.writeInterfaceToken(DESCRIPTOR);

                    //写入 输入
                    _data.writeInt(a);
                    _data.writeInt(b);

                    //写入 binder
                    _data.writeStrongBinder((((callback != null)) ? (callback.asBinder()) : (null)));

                    //如果参数是in/inout类型，那么序列化 参数 到parcel
                    //如果参数是out类型，那么不序列化参数（因为server会重新new出该对象，而不使用client提供的该参数对象）
                    if ((inParcel != null)) {
                        _data.writeInt(1);
                        inParcel.writeToParcel(_data, 0);
                    } else {
                        _data.writeInt(0);
                    }
                    if ((inOutParcel != null)) {
                        _data.writeInt(1);
                        inOutParcel.writeToParcel(_data, 0);
                    } else {
                        _data.writeInt(0);
                    }

                    //执行remote调用：指名调用方法，输入参数，返回参数
                    mRemote.transact(Stub.TRANSACTION_add, _data, _reply, 0);

                    //阻塞到 有返回值
                    //读取异常情况（如：无异常）
                    _reply.readException();

                    //读取返回值
                    _result = _reply.readInt();
                    
                    //如果参数是out/inout类型，那么反序列化出 参数 从parcel
                    if ((0 != _reply.readInt())) {
                        outParcel.readFromParcel(_reply);
                    }
                    if ((0 != _reply.readInt())) {
                        inOutParcel.readFromParcel(_reply);
                    }
                } finally {
                    //回收parcel
                    _reply.recycle();
                    _data.recycle();
                }
                return _result;
            }
        }

        //------------------------------------自身的使用
        @Override
        public android.os.IBinder asBinder() {
            return this;
        }

        //当定位到我（因为我对应了I接口）
        //该方法运行在 binder线程池中
        @Override
        public boolean onTransact(int code, android.os.Parcel data, android.os.Parcel reply, int flags) throws android.os.RemoteException {
            switch (code) {
                case INTERFACE_TRANSACTION: {
                    reply.writeString(DESCRIPTOR);
                    return true;
                }
                //当要调用add方法时
                case TRANSACTION_add: {
                    data.enforceInterface(DESCRIPTOR);

                    //读取输入
                    int _arg0;
                    _arg0 = data.readInt();
                    int _arg1;
                    _arg1 = data.readInt();

                    //读取binder，并变成 I接口.stub.proxy
                    com.ql.bind.IMyLogicCallback _arg2;
                    _arg2 = com.ql.bind.IMyLogicCallback.Stub.asInterface(data.readStrongBinder());

                    //读取自定义parcel（in类型）
                    if ((0 != data.readInt())) {
                        _arg3 = com.ql.bind.bean.MyParcel.CREATOR.createFromParcel(data);
                    } else {
                        _arg3 = null;
                    }

                    //如果参数是out类型，那么不会使用client提供的参数对象，而是new出该对象
                    com.ql.bind.bean.MyParcel _arg4;
                    _arg4 = new com.ql.bind.bean.MyParcel();

                    //读取自定义parcel（inout类型）
                    com.ql.bind.bean.MyParcel _arg5;
                    if ((0 != data.readInt())) {
                        _arg5 = com.ql.bind.bean.MyParcel.CREATOR.createFromParcel(data);
                    } else {
                        _arg5 = null;
                    }

                    //执行方法，stub的子类需要实现该 add本地方法
                    int _result = this.add(_arg0, _arg1, _arg2, _arg3, _arg4, _arg5);

                    //没有产生异常
                    reply.writeNoException();
                    
                    //写入结果
                    reply.writeInt(_result);

                    //如果参数是out类型，那么在执行上述add方法的过程中，设置_arg4的 某些成员变量 的值，后序列化_arg4到reply parcel中
                    if ((_arg4 != null)) {
                        reply.writeInt(1);
                        _arg4.writeToParcel(reply, android.os.Parcelable.PARCELABLE_WRITE_RETURN_VALUE);
                    } else {
                        reply.writeInt(0);
                    }
                    //同理，对于参数类型是inout类型
                    if ((_arg5 != null)) {
                        reply.writeInt(1);
                        _arg5.writeToParcel(reply, android.os.Parcelable.PARCELABLE_WRITE_RETURN_VALUE);
                    } else {
                        reply.writeInt(0);
                    }

                    return true;
                }
            }
            return super.onTransact(code, data, reply, flags);
        }        
    }
}
