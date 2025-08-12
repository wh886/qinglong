/**
 * 青龙面板脚本：ks_Box.js
 * 环境变量：KS_COOKIE
 * 安装依赖：pnpm add axios
 */

const axios = require('axios');

// 1. 基本配置
const url = 'https://nebula.kuaishou.com/rest/wd/encourage/unionTask/treasureBox/report?__NS_sig3=acbcfbcbe2353f6768f05bf3f4f5754fac7e3d65237576ee4f70e3e3e5e5e6e7d8f8&sigCatVer=1';
const TIMEOUT = 10_000;          // 10 秒超时
const MAX_RETRY = 3;             // 最多重试 3 次

// 2. 固定请求头（除 Cookie 外全部默认）
const DEFAULT_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Linux; Android 14; 23054RA19C Build/UP1A.231005.007; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/118.0.0.0 Mobile Safari/537.36 Yoda/3.2.16-rc2 ksNebula/13.7.10.10433 OS_PRO_BIT/64 MAX_PHY_MEM/7486 KDT/PHONE AZPREFIX/az3 ICFO/0 StatusHT/36 TitleHT/221 NetType/WIFI ISLP/0 ISDM/0 ISLB/0 locale/zh-cn DPS/8.279 DPP/60 SHP/2316 SWP/1080 SD/2.75 CT/0 ISLM/0',
  'Content-Type': 'application/json',
  'sec-ch-ua': '"Chromium";v="118", "Android WebView";v="118", "Not=A?Brand";v="99"',
  'sec-ch-ua-platform': '"Android"',
  'sec-ch-ua-mobile': '?1',
  'Origin': 'https://nebula.kuaishou.com',
  'X-Requested-With': 'com.kuaishou.nebula',
  'Sec-Fetch-Site': 'same-origin',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Dest': 'empty',
  'Referer': 'https://nebula.kuaishou.com/nebula/task/earning?layoutType=4&hyId=nebula_earning_ug_cdn&source=bottom_guide_first',
  'Accept-Language': 'zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7'
};

// 3. 检测网络连通性
async function checkNetwork() {
  try {
    await axios.head('https://www.baidu.com', { timeout: 5000 });
    console.log('✅ 网络正常');
    return true;
  } catch {
    console.log('❌ 网络异常，请先检查服务器能否访问外网');
    return false;
  }
}

// 4. 主请求
async function doRequest(cookie) {
  const config = {
    method: 'POST',
    url: URL,
    headers: { ...DEFAULT_HEADERS, Cookie: cookie },
    data: {},
    timeout: TIMEOUT,
    validateStatus: () => true   // 不抛异常，自己判断
  };

  for (let i = 1; i <= MAX_RETRY; i++) {
    try {
      const { status, data } = await axios(config);
      if (status === 200 && data?.result === 0) {
        console.log(`✅ 第 ${i} 次请求成功：`, data);
        return;
      }
      console.log(`⚠️ 第 ${i} 次请求失败：`, data);
    } catch (e) {
      console.log(`⚠️ 第 ${i} 次请求异常：`, e.message);
    }
  }

  console.log('❌ 连续失败 3 次，建议检查 Cookie 或添加代理');
}

// 5. 入口
(async () => {
  const cookie = process.env.KS_COOKIE;
  if (!cookie) {
    console.log('❌ 请先设置环境变量 KS_COOKIE');
    process.exit(1);
  }
  if (!(await checkNetwork())) return;
  await doRequest(cookie);
})();
