addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequest(event).catch((err) => {
      return new Response(err.stack, { status: 500 })
    })
  )
})

addEventListener("scheduled", event => {
  event.waitUntil(handleScheduled(event))
});

const options = { timeZone: 'Asia/Shanghai', hour12: false };

const admin_password = "";

const index_html = `<!DOCTYPE html>
<html>

<head>
    <title>OpenAI密钥管理</title>
    <meta charset="utf-8">
    <!-- seo信息 -->
    <meta name="keywords" content="openai,chatgpt,keyManager">
    <meta name="description" content="OpenAI密钥管理系统，可以对密钥状态进行实时监控。">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css" />
    <style>
        body {
            background: url(https://img.misaka.ren/bg2) no-repeat;
            top: 0;
            left: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-attachment: fixed;
            background-position: center 0;
        }

        .bg {
            background-color: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(5px);
            position: fixed;
            height: 100%;
            width: 100%;
            margin: 0;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: -1;
        }

        .background-color-transparent {
            background-color: rgba(255, 255, 255, 0.5) !important;
        }
    </style>
</head>

<body class="mdui-theme-primary-blue">
    <div class="bg"></div>
    <div class="mdui-container">
        <div class="mdui-typo mdui-center">
            <h2>OpenAI密钥管理</h2>
            <div class="mdui-card background-color-transparent">
                <div class="mdui-card-header">
                    <img class="mdui-card-header-avatar" src="https://img.misaka.ren/avatar" />
                    <div class="mdui-card-header-title">Provided by CloudFlare Worker</div>
                    <div class="mdui-card-header-subtitle">Designed by M1saka</div>
                </div>
                <div class="mdui-card-media">
                    <div class="mdui-card-primary">
                        <div class="mdui-card-primary-title">密钥列表</div>
                    </div>
                </div>
                <div class="mdui-card-content">
                    <div class="mdui-table-fluid">
                        <table class="mdui-table mdui-table-hoverable background-color-transparent">
                            <thead>
                                <tr>
                                    <th>密钥</th>
                                    <th>可用余额</th>
                                    <th>有效期</th>
                                    <th>支付方式</th>
                                    <th>状态</th>
                                </tr>
                            </thead>
                            <tbody>
                                {{Keys}}
                            </tbody>
                        </table>
                    </div>
                    <p>最近更新时间：{{LatestUpdateTime}}</p>
                </div>
                <div class="mdui-card-actions">
                    <button class="mdui-btn mdui-ripple" onclick="window.location.href='/admin'">管理密钥</button>
                </div>
            </div>
        </div>
    </div>
    <div class="mdui-typo mdui-m-t-2">
        <hr />
    </div>
    <div class="mdui-typo mdui-center mdui-m-a-2" style="text-align: center;">
        <p>© 2023 M1saka</p>
    </div>
    </div>
</body>
<script src="https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js"></script>

</html>`;

const admin_login_html = `<!DOCTYPE html>
<html>

<head>
    <title>后台登录-OpenAI密钥管理</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css" />
    <style>
        body {
            background: url(https://img.misaka.ren/bg2) no-repeat;
            top: 0;
            left: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-attachment: fixed;
            background-position: center 0;
        }

        .bg {
            background-color: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(5px);
            position: fixed;
            height: 100%;
            width: 100%;
            margin: 0;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: -1;
        }

        .background-color-transparent {
            background-color: rgba(255, 255, 255, 0.5) !important;
        }
    </style>
</head>

<body class="mdui-theme-primary-blue">
    <div class="bg"></div>
    <div class="mdui-container">
        <div class="mdui-typo mdui-center">
            <h2>后台登陆-OpenAI密钥管理</h2>
            <div class="mdui-card background-color-transparent">
                <div class="mdui-card-header">
                    <img class="mdui-card-header-avatar" src="https://img.misaka.ren/avatar" />
                    <div class="mdui-card-header-title">Provided by CloudFlare Worker</div>
                    <div class="mdui-card-header-subtitle">Designed by M1saka</div>
                </div>
                <div class="mdui-card-media">
                </div>
                <div class="mdui-card-content">
                    <form action="/admin/login" method="post">
                        <input class="mdui-textfield-input" type="password" name="password" placeholder="Password" id="password" />
                        <button class="mdui-btn mdui-ripple" type="submit">登录</button>
                    </form>
                </div>
                <div class="mdui-card-actions">
                    <button class="mdui-btn mdui-ripple" onclick="window.location.href='/'">返回</button>
                </div>
            </div>
        </div>
    </div>
    <div class="mdui-typo mdui-m-t-2">
        <hr />
    </div>
    <div class="mdui-typo mdui-center mdui-m-a-2" style="text-align: center;">
        <p>© 2023 M1saka</p>
    </div>
    </div>
</body>
<script src="https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js"></script>
<script>
    const message = "{{message}}";
    if (message != "{{message}}") {
        mdui.snackbar({
            message: message,
            position: "right-top"
        });
    }
    const token = "{{token}}";
    let localToken = localStorage.getItem("token");
    if (localToken != null && localToken != token) {
        // 使用get请求检测token是否有效
        const url = "/admin/check/" + localToken;
        fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/urlencode"
            }
        }).then(res => {
            if (res.status == 200) {
                mdui.snackbar({
                    message: "登录成功",
                    position: "right-top"
                });
                window.location.href = "/admin/main";
            } else {
                localStorage.removeItem("token");
                window.location.href = "/admin/login";
            }
        })
    }
    if (token != "{{token}}") {
        mdui.snackbar({
            message: "登录成功",
            position: "right-top"
        });
        localStorage.setItem("token", token);
        window.location.href = "/admin/main";
    }
</script>

</html>`;

const admin_html = `<!DOCTYPE html>
<html>

<head>
    <title>密钥管理-OpenAI密钥管理</title>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://unpkg.com/mdui@1.0.2/dist/css/mdui.min.css" />
    <style>
        body {
            background: url(https://img.misaka.ren/bg2) no-repeat;
            top: 0;
            left: 0;
            margin: 0;
            width: 100%;
            height: 100%;
            background-size: cover;
            background-attachment: fixed;
            background-position: center 0;
        }

        .bg {
            background-color: rgba(255, 255, 255, 0.4);
            backdrop-filter: blur(5px);
            position: fixed;
            height: 100%;
            width: 100%;
            margin: 0;
            left: 0;
            right: 0;
            top: 0;
            bottom: 0;
            z-index: -1;
        }

        .background-color-transparent {
            background-color: rgba(255, 255, 255, 0.5) !important;
        }
    </style>
</head>

<body class="mdui-theme-primary-blue">
    <div class="bg"></div>
    <div class="mdui-container">
        <div class="mdui-typo mdui-center">
            <h2>密钥管理-OpenAI密钥管理</h2>
            <div class="mdui-card background-color-transparent">
                <div class="mdui-card-header">
                    <img class="mdui-card-header-avatar" src="https://img.misaka.ren/avatar" />
                    <div class="mdui-card-header-title">Provided by CloudFlare Worker</div>
                    <div class="mdui-card-header-subtitle">Designed by M1saka</div>
                </div>
                <div class="mdui-card-media">
                </div>
                <div class="mdui-card-content">
                    <form action="" method="post">
                        <div class="mdui-textfield">
                            <label class="mdui-textfield-label">Keys</label>
                            <textarea class="mdui-textfield-input" name="keys" type="text" required>{{Keys}}</textarea>
                            <input type="hidden" name="token" value="{{token}}" id="token"/>
                            <input class="mdui-btn mdui-ripple mdui-m-t-2" type="submit" value="提交" />
                        </div>
                    </form>
                </div>
                <div class="mdui-card-actions">
                    <button class="mdui-btn mdui-ripple" onclick="logout()">退出</button>
                </div>
            </div>
        </div>
    </div>
    <div class="mdui-typo mdui-m-t-2">
        <hr />
    </div>
    <div class="mdui-typo mdui-center mdui-m-a-2" style="text-align: center;">
        <p>© 2023 M1saka</p>
    </div>
    </div>
</body>
<script src="https://unpkg.com/mdui@1.0.2/dist/js/mdui.min.js"></script>
<script>
    const message = "{{message}}";
    if (message != "{{message}}") {
        mdui.snackbar({
            message: message,
            position: "right-top"
        });
    }
    let localToken = localStorage.getItem("token");
    if (localToken != null && localToken != token) {
        document.getElementById("token").value = localToken;
        // 使用get请求检测token是否有效
        const url = "/admin/check/" + localToken;
        fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Content-Type": "application/urlencode"
            }
        }).then(res => {
            if (res.status == 200) {
                // 有效
            } else {
                localStorage.removeItem("token");
                window.location.href = "/admin/login";
            }
        })
    }
    function logout() {
        localStorage.removeItem("token");
        window.location.href = "/admin/login";
    }
</script>

</html>`;

class openAI {

  constructor(openAIKey) {
    this.key = openAIKey;
    this.access_until = 0;
    this.available = false;
    this.has_payment_method = false;
    this.balance = 0.0;
  }

  async checkOpenAIAvailability() {
    try {
      const response = await fetch('https://api.openai.com/v1/engines', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.key}`
        }
      });
      if (response.ok) {
        this.available = true;
      } else {
        this.available = false;
      }
    } catch (error) {
      console.error(error);
      this.available = false;
    }
  }

  async getOpenAIBalance() {
    try {
      const subscription_response = await fetch('https://api.openai.com/v1/dashboard/billing/subscription', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.key}`
        }
      });
      const startDate = new Date(new Date().setDate(new Date().getDate() - 99)).toISOString().split('T')[0];
      const endDate = new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0];
      const usage_response = await fetch(`https://api.openai.com/v1/dashboard/billing/usage?start_date=${startDate}&end_date=${endDate}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.key}`
        }
      });
      const subscription_data = await subscription_response.json();
      const usage_data = await usage_response.json();
      if (subscription_data.access_until) {
        this.access_until = subscription_data.access_until;
      }
      if (subscription_data.has_payment_method) {
        this.has_payment_method = subscription_data.has_payment_method;
      }
      if (subscription_data.hard_limit_usd && usage_data.total_usage) {
        this.balance = parseFloat(subscription_data.hard_limit_usd) - parseFloat(String(usage_data.total_usage / 100));
      }
    } catch (error) {
      console.error(error);
    }
  }

}

async function handleKey(key) {
  let data = new openAI(key);
  await data.checkOpenAIAvailability();
  await data.getOpenAIBalance();
  const res = {
    "key": data.key,
    "access_until": data.access_until,
    "available": data.available,
    "has_payment_method": data.has_payment_method,
    "balance": data.balance
  };
  return res;
}

async function handleScheduled(event) {
  // @ts-ignore
  let keys = await db.get('keys');
  keys = keys.split(',');
  let data = []
  for (const key of keys) {
    let res = await handleKey(key);
    data.push(res);
  }
  let date = new Date();
  let res = {
    "date": date.toLocaleString('zh-CN', options),
    "data": data
  }
  // @ts-ignore
  await db.put('res', JSON.stringify(res));
  return Promise.resolve('Success');
}

async function useableKey() {
  // @ts-ignore
  let res = await db.get('res');
  res = JSON.parse(res);
  let data = res.data;
  let keys = [];
  for (const key of data) {
    if (key.available && key.balance > 0 && key.access_until * 1000 > Date.now()) {
      keys.push(key.key);
    }
  }
  return keys;
}

async function handleRequest(event) {
  let url = new URL(event.request.url);
  let type = url.pathname.substring(1).split('/')[0];
  const init = {
    headers: {
      'content-type': 'text/html;charset=UTF-8',
    },
  }
  if (type == "api") {
    let passwd = url.pathname.substring(1).split('/')[1];
    if (passwd) {
      if (passwd == admin_password) {
        let keys = await useableKey();
        if (keys.length == 0) {
          return new Response("No available key", { status: 404 });
        }
        let json = JSON.stringify({ "keys": keys });
        return new Response(json, { "headers": { "content-type": "application/json;charset=UTF-8" } });
      }
      return new Response("Invalid password", { status: 403 });
    }
    return new Response("Invalid password", { status: 403 });
  }
  if (type == "admin") {
    let html = admin_login_html;
    let action = url.pathname.substring(1).split('/')[1];
    if (!action) {
      return Response.redirect(url.protocol + url.hostname + '/admin/login', 302);
    }
    if (action == "login") {
      if (event.request.method == "POST") {
        let json = await readRequestBody(event.request);
        if (!json) {
          return new Response("Invalid Content-Type", { status: 400 });
        }
        json = JSON.parse(json);
        if (!json.password) {
          html = html.replace("{{message}}", "提交失败");
          return new Response(html, init);
        }
        if (json.password == admin_password) {
          html = html.replace("{{message}}", "登录成功");
          html = html.replace("{{token}}", await tokenGenerator(admin_password));
          return new Response(html, init);
        }
        html = html.replace("{{message}}", "提交失败");
        return new Response(html, init);
      }
      return new Response(html, init);
    }
    if (action == "check") {
      let token = url.pathname.substring(1).split('/')[2];
      if (!token) {
        return new Response("Invalid token", { status: 403 });
      }
      let new_token = await tokenGenerator(admin_password);
      if (token == new_token) {
        return new Response("Success", { status: 200 });
      }
      return new Response("Invalid token", { status: 403 });
    }

    if (action == "main") {
      html = admin_html;
      // @ts-ignore
      let keys = await db.get('keys');
      html = html.replace("{{Keys}}", keys);
      if (event.request.method == "POST") {
        let json = await readRequestBody(event.request);
        if (!json) {
          return new Response("Invalid Content-Type", { status: 400 });
        }
        json = JSON.parse(json);
        if (!json.token) {
          html = html.replace("{{message}}", "提交失败");
          return new Response(html, init);
        }
        let token = await tokenGenerator(admin_password);
        if (json.token != token) {
          html = html.replace("{{message}}", "提交失败");
          return new Response(html, init);
        }
        if (!json.keys) {
          html = html.replace("{{message}}", "提交失败");
          return new Response(html, init);
        }
        // @ts-ignore
        await db.put('keys', json.keys);
        html = html.replace("{{message}}", "提交成功");
        html = html.replace("{{keys}}", json.keys);
        return new Response(html, init);
      }
      return new Response(html, init);
    }
  }
  // @ts-ignore
  let res = await db.get('res');
  if (!res) {
    return new Response('error', { status: 500 });
  }
  res = JSON.parse(res);
  let html = index_html;
  html = html.replace("{{LatestUpdateTime}}", res.date);
  let table = "";
  for (const item of res.data) {
    let tr = "<tr><td>";
    let access_until = new Date(item.access_until * 1000);
    tr = tr + `${item.key.substring(0, 5)}***${item.key.substring(item.key.length - 3)}</td><td>${item.balance}</td><td>${access_until.toLocaleString('zh-CN', options)}</td><td>${item.has_payment_method == true ? '<i class="mdui-icon material-icons">check</i>' : '<i class="mdui-icon material-icons">close</i>'}</td><td>${item.available == true ? '<i class="mdui-icon material-icons">check</i>' : '<i class="mdui-icon material-icons">close</i>'}</td></tr>\n`
    table = table + tr;
  }
  html = html.replace("{{Keys}}", table);
  return new Response(html, init);
}

async function readRequestBody(request) {
  const { headers } = request;
  const contentType = headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    return JSON.stringify(await request.json());
  } else if (contentType.includes('application/text')) {
    return request.text();
  } else if (contentType.includes('text/html')) {
    return request.text();
  } else if (contentType.includes('form')) {
    const formData = await request.formData();
    const body = {};
    for (const entry of formData.entries()) {
      body[entry[0]] = entry[1];
    }
    return JSON.stringify(body);
  } else {
    return 0;
  }
}

async function tokenGenerator(password) {
  let year = new Date().getFullYear();
  const msgBuffer = new TextEncoder().encode(password + year);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}