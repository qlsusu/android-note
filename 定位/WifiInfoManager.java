package com.ql.datamine.tool.location;

import java.util.ArrayList;

import android.content.Context;
import android.net.wifi.WifiManager;

class WifiInfoManager {

	WifiManager wm;

	static WifiInfoManager instance = new WifiInfoManager();

	private WifiInfoManager() {
	}

	ArrayList getWifiInfo(Context context) {
		ArrayList<WifiInfo> wifi = new ArrayList();
		wm = (WifiManager) context.getSystemService(Context.WIFI_SERVICE);
		WifiInfo info = new WifiInfo();
		info.mac = wm.getConnectionInfo().getBSSID();
		wifi.add(info);
		return wifi;
	}
}