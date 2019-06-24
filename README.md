# Reservation Kit

> Reservation service for SWJTU-Leeds Joint School

## Build Setup

``` bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev

# build for production and launch server
$ yarn run build
$ yarn start
```

## Etheral Account
### Sender
Name:	Emie Koss

Username:	emie67@ethereal.email

Password:	XAYE3rGX5eRvDJzntz

### Receiver
Name	Mathias Ullrich

Username	mathias.ullrich4@ethereal.email

Password	JsdP4Bt7qFZq9DVjr3

## 说明文档
### 技术选型

#### 后端
* Express <- Feathers.js
* Socket.io
* MongoDB

#### 前端
* Nuxt.js (Based on Vue.js)
* UI: Vuetify (Material Design)
* Communication: Socket.io + FeathersVuex
* State Management: Vuex + FeathersVuex

### 部署方式
Heroku 等可直接检测并自动构建，运行。Docker及VPS/独立服务器参考上文中 `Build Setup`。

数据库连接成功后如无用户存在，一个登录ID为 `0001`，密码为 `admin` 的管理员用户会自动被创建。

### 主要功能、流程

#### 自习室或教室预约
两种不同类别的预约流程基本一致，选择教室或自习室后会根据房间的类型显示座位图或预约表单。用户可在 `My Reservations` 页面查看自己的预约记录。

##### 自习室
目前可以预约30分钟内的座位（开放时间前30分钟开始可以预约，开放时间结束前2 * 30分钟关闭预约，预约30分钟内有效（时长可配置），超时即为违约。

预约请求提交后，后端将验证：
* 该座位是否已经被占用
* 同一用户是否已经预约过其他座位（目前不允许）
* 该用户一个月内是否违约超过3次。

如预约请求通过，新的座位占用信息会通过 WebSocket 实时推送给所有在线的客户端。

用户可以取消5分钟内创建，但尚未签到的预约请求。

##### 教室
教室预约可以接受提前 `[x, y]` 天预约（可配置）。每次预约最小时长默认为30分钟（可配置）。这种预约类型需要管理员手工审核，审核完毕后会通过邮件向申请人推送结果（时间所限仅有数据库模型，具体流程暂未实现）。

#### 自习室签到、签离
目前采用在自习室出入口摆放设备，扫描用户出示的二维码（可在 `QR Code` 页面查看），设备上只需打开相应网页（`Admin -> Kiosk`）即可工作。

后续如需和门禁等系统联动，可以将该网页转换为 Electron App，利用其调用原生 API 的能力通过USB或串口、网络与相应硬件设备联动。

#### 管理功能

##### 房间管理
支持添加，修改房间信息，包含名称、开放时间、需要显示给使用者的相应信息、违约时长/最小预约时长、房间座位图等。房间座位图支持可视化拖动编辑。

##### 用户管理
支持常规的用户管理功能，包含创建、编辑等。目前 UI 暂不支持批量导入，但是可以通过直接调用 API 完成。