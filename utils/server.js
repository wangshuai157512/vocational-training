// 是否为开发环境
// const devUrl = "http://localhost:3002/wx";
const devUrl = "https://uec.chinaedu.net/wx";
const lineUrl = "https://xxzx.chinaedu.net/wx"

const devImg = "https://uec.chinaedu.net";
// const devImg = "http://localhost:3002";
const lineImg = "https://xxzx.chinaedu.net"

const isDev = true // 开发环境
const baseUrl = isDev? devUrl : lineUrl
const normalUrl = isDev? devImg : lineImg
const authUser = baseUrl + '/api/xc_login/authUserInfo'//用户信息授权
const login = baseUrl + '/api/xc_login/login'//登录
const authPhone = baseUrl + '/api/xc_login/authPhone' // 手机号
const addUser = baseUrl + '/api/xc_channel/addUser' // 申请
const HotClass = baseUrl + '/api/xc_course/getHotClass' // 热门项目
const hotClassDetail = baseUrl + '/api/xc_course/hotClassDetail' // 热门项目详情
const OtherProject = baseUrl + '/api/xc_course/getOtherProject' // 其他项目
const projectDetail = baseUrl + '/api/xc_course/projectDetail' // 获取分类详情
const addTeacherName = baseUrl + '/api/xc_teacher/addTeacherName' // 更新老师姓名
const getTeacherName = baseUrl + '/api/xc_teacher/getTeacherName' // 获取老师姓名
const createCode = baseUrl + '/api/QRC_code/createCode' // 生成二维码
const getShareList = baseUrl + '/api/xc_user/getShareList' // 分享列表
const isGroup = baseUrl + '/api/squad/getSquadStatus'  // 是否开团
const createGroup = baseUrl + '/api/squad/createSquad' // 建团
const getSquadUser = baseUrl + '/api/squad/getSquadUser' // 参团人员
const addSquad = baseUrl + '/api/squad/addSquad' // 加入队伍
const getMySquad = baseUrl + '/api/squad/getMySquad' // 我的拼团
const getMySquadList = baseUrl + '/api/squad/getMySquadList' // 我的拼团列表
const squadState = baseUrl + '/api/squad/getSquadState' // 我的拼团状态
const MyMaterial = baseUrl + '/api/xc_material/getMyMaterial' // 我的资料包
const materials = baseUrl + '/api/xc_material/getMaterial' // 资料包
const getMaterialPackageDetail = baseUrl + '/api/xc_material/getMaterialPackageDetail' // 资料详情标签
const getMaterialList = baseUrl + '/api/xc_course/getMaterialList' // 资料列表
const showContent = baseUrl + '/api/it_login/iteduIsShowContent' // 审核模式


export default {
    normalUrl,
    authUser: authUser,
    login: login,
    authPhone: authPhone,
    addUser: addUser,
    HotClass: HotClass,
    hotClassDetail: hotClassDetail,
    OtherProject: OtherProject,
    projectDetail: projectDetail,
    addTeacherName: addTeacherName,
    getTeacherName: getTeacherName,
    createCode : createCode,
    getShareList : getShareList,
    isGroup : isGroup,
    createGroup : createGroup,
    getSquadUser : getSquadUser,
    addSquad : addSquad,
    getMySquad : getMySquad,
    getMySquadList : getMySquadList,
    squadState : squadState,
    MyMaterial : MyMaterial,
    materials : materials,
    getMaterialPackageDetail : getMaterialPackageDetail,
    getMaterialList : getMaterialList,
    showContent : showContent,
}
