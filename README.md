**职业培训课小程序**

## 拼团逻辑 ##

1.首次进去页面判断是否开过团或者加入过团
2.显示当前团列表，请求团列表时，自己有团squadId使用自己的squadId，自己没有时，使用options里面的squadId
3.squadState为团状态，0 拼团失败 1 拼团成功 2 拼团进行中

## 订阅消息 ##

使用一次性订阅消息，同意一次，只能收一条消息

## 教师码裂变 ##

1.合成海报的二维码上带着教师userId
2.用户扫海报图，获取的userId,赋值给当前用户的shareUserId，
3.用户转发时带出shareUserId从而裂变出多个下级

## 小程序码 ##

![](https://xxzx.chinaedu.net/wx/img/1595232557019.jpg)

## 教师入口码 ##

![](https://xxzx.chinaedu.net/wx/img/1595232969636.jpg)