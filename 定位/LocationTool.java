package com.ql.datamine.tool.location;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLConnection;
import java.util.ArrayList;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import android.content.Context;
import android.location.Location;
import android.location.LocationManager;
import android.util.Log;

public class LocationTool {
	static BufferedWriter writer;

	static {
		try {
			writer = new BufferedWriter(new FileWriter(new File(
					"/sdcard/gaga.txt")));
		} catch (IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
	}

	public static Location callGear(Context context) {
		ArrayList<WifiInfo> wifi = WifiInfoManager.instance
				.getWifiInfo(context);
		ArrayList<CellIDInfo> cellID = CellIDInfoManager.instance
				.getCellIDInfo(context);

		if (cellID == null)
			return null;

		DefaultHttpClient client = new DefaultHttpClient();

		HttpPost post = new HttpPost("http://www.google.com/loc/json");
		JSONObject holder = new JSONObject();

		try {
			holder.put("version", "1.1.0");
			holder.put("host", "maps.google.com");
			holder.put("home_mobile_country_code",
					cellID.get(0).mobileCountryCode);
			holder.put("home_mobile_network_code",
					cellID.get(0).mobileNetworkCode);
			holder.put("radio_type", cellID.get(0).radioType);
			holder.put("request_address", true);
			if ("460".equals(cellID.get(0).mobileCountryCode))
				holder.put("address_language", "zh_CN");
			else
				holder.put("address_language", "en_US");

			JSONObject data, current_data;

			JSONArray array = new JSONArray();

			current_data = new JSONObject();
			current_data.put("cell_id", cellID.get(0).cellId);
			current_data.put("location_area_code",
					cellID.get(0).locationAreaCode);
			current_data.put("mobile_country_code",
					cellID.get(0).mobileCountryCode);
			current_data.put("mobile_network_code",
					cellID.get(0).mobileNetworkCode);
			current_data.put("age", 0);
			array.put(current_data);

			if (cellID.size() > 2) {
				for (int i = 1; i < cellID.size(); i++) {
					data = new JSONObject();
					data.put("cell_id", cellID.get(i).cellId);
					data.put("location_area_code",
							cellID.get(0).locationAreaCode);
					data.put("mobile_country_code",
							cellID.get(0).mobileCountryCode);
					data.put("mobile_network_code",
							cellID.get(0).mobileNetworkCode);
					data.put("age", 0);
					array.put(data);
				}
			}
			holder.put("cell_towers", array);

			System.out.println("request data:" + holder);

			if (wifi.get(0).mac != null) {
				data = new JSONObject();
				data.put("mac_address", wifi.get(0).mac);
				data.put("signal_strength", 8);
				data.put("age", 0);
				array = new JSONArray();
				array.put(data);
				holder.put("wifi_towers", array);
			}

			StringEntity se = new StringEntity(holder.toString());
			Log.e("Location send", holder.toString());
			post.setEntity(se);
			HttpResponse resp = client.execute(post);

			HttpEntity entity = resp.getEntity();

			BufferedReader br = new BufferedReader(new InputStreamReader(
					entity.getContent()));
			StringBuffer sb = new StringBuffer();
			String result = br.readLine();
			while (result != null) {
				Log.e("Locaiton reseive", result);

				sb.append(result);
				result = br.readLine();
			}

			System.out.println("result data:" + sb);

			writer.write(sb.toString());
			writer.flush();

			data = new JSONObject(sb.toString());
			data = (JSONObject) data.get("location");

			Location loc = new Location(LocationManager.NETWORK_PROVIDER);
			loc.setLatitude((Double) data.get("latitude"));
			loc.setLongitude((Double) data.get("longitude"));
			loc.setAccuracy(Float.parseFloat(data.get("accuracy").toString()));
			// loc.setTime(AppUtil.getUTCTime());
			return loc;
		} catch (JSONException e) {
			return null;
		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		} catch (ClientProtocolException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static String getAddress(String latitude, String longitude) {
		String addr = "";

		// 也可以是http://maps.google.cn/maps/geo?output=csv&key=abcdef&q=%s,%s，不过解析出来的是英文地址
		// 密钥可以随便写一个key=abc
		// output=csv,也可以是xml或json，不过使用csv返回的数据最简洁方便解析
		String url = String.format(
				"http://ditu.google.cn/maps/geo?output=csv&key=abcdef&q=%s,%s",
				latitude, longitude);
		URL myURL = null;
		URLConnection httpsConn = null;
		try {
			myURL = new URL(url);
		} catch (MalformedURLException e) {
			e.printStackTrace();
			return null;
		}
		try {
			httpsConn = (URLConnection) myURL.openConnection();
			if (httpsConn != null) {
				BufferedReader br = new BufferedReader(new InputStreamReader(
						httpsConn.getInputStream(), "UTF-8"));
				String data = null;
				if ((data = br.readLine()) != null) {
					writer.write(data);
					writer.flush();
					System.out.println(data);
					String[] retList = data.split(",");
					if (retList.length > 2 && ("200".equals(retList[0]))) {
						addr = retList[2];
						addr = addr.replace("\"", "");
					} else {
						addr = "";
					}
				}
				br.close();
			}
		} catch (IOException e) {
			e.printStackTrace();
			return null;
		}
		return addr;
	}
}
