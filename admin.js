(() => {
  const root = document.getElementById("adminApp");
  const loginPage = document.getElementById("loginPage");
  if (!root || !loginPage) return;

  const platform = {
    id: "platform",
    code: "HYD-PLATFORM",
    name: "华洋达跨境物流平台",
    type: "平台层级"
  };

  const permissionMenus = [
    { id: "home", label: "首页", buttons: ["查看", "刷新", "导出"], fields: ["在途运单", "待审批", "异常消息", "海外仓库存"] },
    { id: "employees", label: "员工管理", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制"], fields: ["员工编号", "姓名", "登录账号", "手机号", "邮箱", "组织归属", "角色权限", "状态", "最近登录"] },
    { id: "roles", label: "角色管理", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制", "权限预览"], fields: ["角色编码", "角色名称", "数据范围", "菜单权限", "按钮权限", "字段权限", "状态"] },
    { id: "hq", label: "总部管理", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制"], fields: ["编码", "总部名称", "所属平台", "负责人", "联系电话", "状态", "说明"] },
    { id: "region", label: "大区管理", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制"], fields: ["编码", "大区名称", "所属总部", "负责人", "联系电话", "状态", "说明"] },
    { id: "branch", label: "分公司", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制"], fields: ["编码", "分公司名称", "所属大区", "负责人", "联系电话", "状态", "说明"] },
    { id: "warehouse", label: "仓库", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制"], fields: ["编码", "仓库名称", "所属平台", "所在城市", "仓储容量", "负责人", "联系电话", "状态", "说明"] },
    { id: "department", label: "部门", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制"], fields: ["编码", "部门名称", "上级类型", "上级层级", "负责人", "联系电话", "状态", "说明"] },
    { id: "team", label: "小组", buttons: ["查询", "新增", "编辑", "删除", "启用", "停用", "导出", "复制"], fields: ["编码", "小组名称", "所属部门", "负责人", "联系电话", "状态", "说明"] }
  ];

  const orgConfig = {
    hq: { title: "总部管理", singular: "总部", collection: "headquarters", parentKind: "platform", managerLabel: "负责人" },
    region: { title: "大区管理", singular: "大区", collection: "regions", parentKind: "headquarters", parentLabel: "所属总部", managerLabel: "负责人" },
    branch: { title: "分公司", singular: "分公司", collection: "branches", parentKind: "regions", parentLabel: "所属大区", managerLabel: "负责人" },
    warehouse: { title: "仓库", singular: "仓库", collection: "warehouses", parentKind: "platform", managerLabel: "仓库负责人" },
    department: { title: "部门", singular: "部门", collection: "departments", parentKind: "mixed", parentLabel: "上级层级", managerLabel: "部门负责人" },
    team: { title: "小组", singular: "小组", collection: "teams", parentKind: "departments", parentLabel: "所属部门", managerLabel: "小组负责人" }
  };

  const parentTypeLabels = {
    headquarters: "总部",
    regions: "大区",
    branches: "分公司",
    warehouses: "仓库",
    departments: "部门"
  };

  const referenceNavItems = [
    {
      id: "baseData",
      label: "基础",
      children: [
        refLeaf("customerManage", "客户管理", "基础", "customer"),
        refLeaf("providerManage", "服务商管理", "基础", "provider"),
        refLeaf("bankAccount", "银行账户", "基础", "bank"),
        refLeaf("skuLibrary", "SKU库", "基础", "sku")
      ]
    },
    {
      id: "waybill",
      label: "运单",
      children: [
        refLeaf("pickupDelivery", "提送货管理", "运单", "order"),
        refLeaf("warehouseReceipt", "入仓单", "运单", "order"),
        refLeaf("draftOrder", "创建草单", "运单", "order"),
        refLeaf("lineOrder", "专线下单", "运单", "order"),
        refLeaf("containerOrder", "整柜下单", "运单", "order"),
        refLeaf("batchImport", "批量导入", "运单", "import"),
        refLeaf("waybillManage", "运单管理", "运单", "waybill"),
        refLeaf("customerBill", "客户提单", "运单", "waybill")
      ]
    },
    {
      id: "customerService",
      label: "客服",
      children: [
        refLeaf("customerClaim", "客户理赔", "客服", "claim"),
        refLeaf("providerClaim", "服务商理赔", "客服", "claim"),
        refLeaf("remoteAreaMaintain", "偏远住宅维护", "客服", "config"),
        refLeaf("remoteAreaQuery", "偏远住宅查询", "客服", "query"),
        refLeaf("trackMaintain", "轨迹维护", "客服", "config"),
        refLeaf("trackQuery", "轨迹查询", "客服", "query"),
        refLeaf("fuelMaintain", "燃油维护", "客服", "config"),
        refLeaf("fuelQuery", "燃油查询", "客服", "query"),
        refLeaf("problemType", "问题件类型", "客服", "config")
      ]
    },
    {
      id: "warehouseOps",
      label: "仓库",
      children: [
        refLeaf("noOrderInbound", "无单入库管理", "仓库", "warehouse"),
        refLeaf("quickReceive", "快速收货", "仓库", "warehouse"),
        refLeaf("inboundReview", "入库数据复核", "仓库", "review"),
        refLeaf("outboundReview", "出库数据复核", "仓库", "review"),
        refLeaf("openBoxCheck", "开箱验货管理", "仓库", "warehouse"),
        refLeaf("transferOut", "调拨出库", "仓库", "warehouse"),
        refLeaf("transferIn", "调拨入库", "仓库", "warehouse"),
        refLeaf("documentCreate", "制单创建", "仓库", "warehouse"),
        refLeaf("labelDownload", "面单查询下载", "仓库", "download"),
        refLeaf("externalOutbound", "外配出库管理", "仓库", "warehouse"),
        refLeaf("palletPrint", "托盘标打印", "仓库", "print"),
        refLeaf("palletWaybillQuery", "托盘查询/运单查询", "仓库", "query"),
        refLeaf("expressBindTemp", "快递绑定临时数据", "仓库", "warehouse"),
        refLeaf("replenishQuery", "补货落货查询", "仓库", "query"),
        refLeaf("stockTake", "库内盘点", "仓库", "warehouse"),
        refLeaf("instructionManage", "指令管理", "仓库", "warehouse")
      ]
    },
    {
      id: "operation",
      label: "操作",
      children: [
        refLeaf("exceptionTicket", "异常服务工单", "操作", "ticket"),
        refLeaf("headProblem", "头程问题件", "操作", "ticket"),
        refLeaf("bookingManage", "订舱管理", "操作", "operation"),
        refLeaf("documentManage", "单证管理", "操作", "operation"),
        refLeaf("billOfLading", "提单管理", "操作", "operation"),
        refLeaf("simulateAllocation", "模拟配舱", "操作", "operation"),
        refLeaf("preAllocation", "预配舱登记", "操作", "operation"),
        refLeaf("finalAllocation", "终配舱登记", "操作", "operation"),
        refLeaf("waybillInsurance", "运单投保管理", "操作", "operation"),
        refLeaf("billInsurance", "提单投保管理", "操作", "operation"),
        refLeaf("customsPreEntry", "报关预录单", "操作", "customs"),
        refLeaf("customsManage", "报关管理", "操作", "customs"),
        refLeaf("clearanceManage", "清关管理", "操作", "customs"),
        refLeaf("taxBillManage", "税单管理", "操作", "finance"),
        refLeaf("trackConfig", "轨迹配置", "操作", "config"),
        refLeaf("preWarehouseRule", "预配仓规则", "操作", "config"),
        refLeaf("clearanceKnowledge", "清关知识库", "操作", "master"),
        refLeaf("taxRateKnowledge", "税单税率知识库", "操作", "master"),
        refLeaf("sailingSchedule", "船期管理", "操作", "operation")
      ]
    },
    {
      id: "overseasOperation",
      label: "海外操作",
      children: [
        refLeaf("overseasProblem", "海外问题件", "海外操作", "ticket"),
        refLeaf("billSplit", "提单提拆", "海外操作", "operation"),
        refLeaf("truckOutboundPlan", "卡派出库计划", "海外操作", "operation"),
        refLeaf("expressOutboundPlan", "快递出库计划", "海外操作", "operation"),
        refLeaf("selfPickupPlan", "自提出库计划", "海外操作", "operation"),
        refLeaf("expressFollow", "快递单票跟进", "海外操作", "operation"),
        refLeaf("selfPickupFollow", "自提单票跟进", "海外操作", "operation")
      ]
    },
    {
      id: "finance",
      label: "财务",
      children: [
        refLeaf("bankVoucher", "银行凭证", "财务", "finance"),
        refLeaf("businessStats", "业务数据统计", "财务", "finance"),
        refLeaf("prepayApply", "预付款申请", "财务", "finance"),
        refLeaf("invoiceManage", "开票管理", "财务", "finance"),
        {
          id: "receivable",
          label: "应收管理",
          children: [
            refLeaf("receivableDetail", "应收明细", "财务 / 应收管理", "finance"),
            refLeaf("receivableBill", "应收账单管理", "财务 / 应收管理", "finance"),
            refLeaf("receiptManage", "收款管理", "财务 / 应收管理", "finance"),
            refLeaf("receivableChange", "应收异动申请", "财务 / 应收管理", "finance")
          ]
        },
        {
          id: "payable",
          label: "应付管理",
          children: [
            refLeaf("estimatedCost", "预估成本明细", "财务 / 应付管理", "finance"),
            refLeaf("agentActualCost", "代理实际成本", "财务 / 应付管理", "finance"),
            refLeaf("payableBill", "应付账单管理", "财务 / 应付管理", "finance"),
            refLeaf("salesCostDetail", "业务员成本明细", "财务 / 应付管理", "finance")
          ]
        },
        {
          id: "internalPayment",
          label: "内部付款",
          children: [
            refLeaf("internalPaymentDetail", "内部付款明细", "财务 / 内部付款", "finance"),
            refLeaf("internalPayableBill", "内部应付账单", "财务 / 内部付款", "finance"),
            refLeaf("internalReceivableBill", "内部应收账单", "财务 / 内部付款", "finance"),
            refLeaf("internalMarkupRate", "内部加点比例", "财务 / 内部付款", "config")
          ]
        }
      ]
    },
    {
      id: "product",
      label: "产品",
      children: [
        {
          id: "estimatedBaseFee",
          label: "预估基础费用",
          children: [
            refLeaf("billBaseFee", "提单基础费用", "产品 / 预估基础费用", "product"),
            refLeaf("billStandardCost", "提单标准成本", "产品 / 预估基础费用", "product")
          ]
        },
        refLeaf("providerChannelExternal", "服务商渠道管理（外配）", "产品", "product"),
        refLeaf("ownRoute", "指定路线（自有渠道）", "产品", "product"),
        refLeaf("headCostManage", "头程成本管理", "产品", "product"),
        refLeaf("tailBusinessCost", "尾程业务成本", "产品", "product"),
        refLeaf("salesCost", "业务员成本", "产品", "product"),
        refLeaf("receivableSurcharge", "附加杂费配置（应收）", "产品", "product"),
        refLeaf("businessSurcharge", "附加杂费配置（业务成本）", "产品", "product"),
        refLeaf("zoneManage", "分区管理", "产品", "product"),
        refLeaf("weightSegment", "重量段管理", "产品", "product"),
        refLeaf("densityDiscount", "比重优惠", "产品", "product"),
        refLeaf("businessPriceApply", "业务价格申请", "产品", "product"),
        refLeaf("weightPriceQuery", "货重比查价", "产品", "query"),
        refLeaf("weightQuoteCalc", "货重比测算报价", "产品", "query"),
        refLeaf("truckCostCalc", "卡派测价（业务成本）", "产品", "query"),
        refLeaf("labelCostCalc", "打单测价（业务成本）", "产品", "query"),
        refLeaf("labelPriceConfig", "打单测价配置", "产品", "config"),
        refLeaf("deliveryAging", "派送时效", "产品", "config"),
        refLeaf("standardAging", "标准时效", "产品", "config")
      ]
    },
    {
      id: "systemConfig",
      label: "配置",
      children: [
        refLeaf("riskRule", "风控规则", "配置", "config"),
        refLeaf("approvalFlow", "审核流程", "配置", "config"),
        refLeaf("todoFlow", "待办流程", "配置", "config"),
        refLeaf("messageManage", "消息管理", "配置", "config"),
        refLeaf("labelTemplate", "标签模版", "配置", "config"),
        refLeaf("exportTemplate", "导出模版", "配置", "config"),
        refLeaf("documentAgentChannel", "制单代理可用渠道", "配置", "config"),
        {
          id: "masterData",
          label: "基础资料",
          children: [
            refLeaf("warehouseList", "仓库列表", "配置 / 基础资料", "master"),
            refLeaf("dataDictionary", "数据字典", "配置 / 基础资料", "master"),
            refLeaf("exchangeRate", "汇率管理", "配置 / 基础资料", "master"),
            refLeaf("countryList", "国家列表", "配置 / 基础资料", "master"),
            refLeaf("provinceList", "州/省列表", "配置 / 基础资料", "master"),
            refLeaf("cityList", "城市列表", "配置 / 基础资料", "master"),
            refLeaf("portAirportList", "港口机场列表", "配置 / 基础资料", "master"),
            refLeaf("financeSubject", "财务科目", "配置 / 基础资料", "master")
          ]
        }
      ]
    },
    {
      id: "todo",
      label: "待办",
      children: [
        refLeaf("myApproval", "我的审批", "待办", "todo"),
        refLeaf("myMessage", "我的消息", "待办", "todo")
      ]
    },
    {
      id: "business",
      label: "业务",
      children: [
        {
          id: "crm",
          label: "CRM",
          children: [
            refLeaf("publicCustomer", "公海客户", "业务 / CRM", "crm"),
            refLeaf("customerFollow", "客户跟进", "业务 / CRM", "crm")
          ]
        },
        refLeaf("businessCostPriceQuery", "价格查询（业务成本）", "业务", "query"),
        refLeaf("customerQuoteQuery", "报价查询（业务对客）", "业务", "query"),
        refLeaf("businessWaybillManage", "业务运单管理", "业务", "waybill")
      ]
    }
  ];

  const referenceMenuConfigs = Object.fromEntries(flatMenuItems(referenceNavItems).map((item) => [item.id, item]));
  Object.assign(referenceMenuConfigs.myApproval, {
    fields: ["审批编号", "审批事项", "发起人", "发起时间", "审批状态", "当前节点", "抄送人"],
    actions: ["query", "approve", "reject", "transfer", "detail", "export"]
  });
  Object.assign(referenceMenuConfigs.myMessage, {
    fields: ["消息编号", "消息事项", "发起人", "发起时间", "处理状态", "当前节点", "抄送人"],
    actions: ["query", "handled", "ignore", "detail", "export"]
  });
  ["waybillManage", "businessWaybillManage"].forEach((id) => {
    Object.assign(referenceMenuConfigs[id], {
      fields: ["运单号", "客户名称", "渠道产品", "目的国家", "计费重", "运输状态", "运单状态", "创建时间"],
      actions: ["query", "export"]
    });
  });
  const referenceMenuIds = new Set(Object.keys(referenceMenuConfigs));

  permissionMenus.push(...Object.values(referenceMenuConfigs).map((item) => ({
    id: item.id,
    label: item.label,
    buttons: actionLabelsForMenu(item.id, item.actions),
    fields: item.fields
  })));

  const nav = [
    { id: "home", label: "首页" },
    ...referenceNavItems,
    {
      id: "permission",
      label: "权限",
      children: [
        { id: "employees", label: "员工管理" },
        { id: "roles", label: "角色管理" },
        {
          id: "org",
          label: "组织架构",
          children: [
            { id: "hq", label: "总部管理" },
            { id: "region", label: "大区管理" },
            { id: "branch", label: "分公司" },
            { id: "warehouse", label: "仓库" },
            { id: "department", label: "部门" },
            { id: "team", label: "小组" }
          ]
        }
      ]
    }
  ];

  const listPageIds = new Set(["employees", "roles", "hq", "region", "branch", "warehouse", "department", "team", ...referenceMenuIds]);
  const orgTreePageIds = new Set(["employees", "region", "branch", "warehouse", "department", "team"]);
  const orgTreeSelectableKinds = {
    employees: new Set(["departments", "teams"]),
    region: new Set(["headquarters"]),
    branch: new Set(["regions"]),
    warehouse: new Set(["platform"]),
    department: new Set(["headquarters", "regions", "branches", "warehouses"]),
    team: new Set(["departments"])
  };

  const permissionTree = nav.map(permissionNodeFromNav);

  const allPermissions = () => Object.fromEntries(permissionMenus.map((menu) => [
    menu.id,
    { enabled: true, buttons: [...menu.buttons], fields: [...menu.fields] }
  ]));

  const limitedPermissions = (...ids) => Object.fromEntries(permissionMenus.map((menu) => [
    menu.id,
    ids.includes(menu.id)
      ? { enabled: true, buttons: menu.buttons.filter((item) => item !== "删除"), fields: [...menu.fields] }
      : { enabled: false, buttons: [], fields: [] }
  ]));

  const accountOrgOptions = [
    { id: "dept-customs", label: "华洋达跨境物流平台 / 华东运营总部 / 关务合规部", scope: "所属组织及下级" },
    { id: "team-doc", label: "华洋达跨境物流平台 / 华东运营总部 / 关务合规部 / 单证小组", scope: "当前小组" },
    { id: "region-yangtze", label: "华洋达跨境物流平台 / 华东运营总部 / 长三角大区", scope: "大区及下级" },
    { id: "wh-ningbo", label: "华洋达跨境物流平台 / 宁波保税仓", scope: "仓库及下级部门" }
  ];

  const state = {
    active: "home",
    openTabs: ["home"],
    currentOrgId: "dept-customs",
    homeRange: "month",
    expanded: new Set(),
    filters: {},
    filterExpanded: new Set(),
    pagination: {},
    orgTreeSelection: {},
    orgTreeExpanded: new Set(["platform"]),
    pendingOrgTreeAnchor: null,
    selectedRows: new Set(),
    selectedCells: new Map(),
    isCellDragging: false,
    dragMode: "add",
    contextTabId: "",
    entryMethod: "account",
    data: {
      org: {
        headquarters: [
          { id: "hq-east", code: "HQ-EAST", name: "华东运营总部", manager: "林岚", phone: "13800010001", parentId: "platform", status: "启用", remark: "统筹华东海运与清关资源" },
          { id: "hq-south", code: "HQ-SOUTH", name: "华南运营总部", manager: "陈越", phone: "13800010002", parentId: "platform", status: "启用", remark: "覆盖粤港澳与东南亚线路" }
        ],
        regions: [
          { id: "region-yangtze", code: "RG-YRD", name: "长三角大区", manager: "周宁", phone: "13800020001", parentId: "hq-east", status: "启用", remark: "宁波、上海、苏州业务协同" },
          { id: "region-gba", code: "RG-GBA", name: "大湾区大区", manager: "黄嘉", phone: "13800020002", parentId: "hq-south", status: "启用", remark: "空运与跨境电商干线" }
        ],
        branches: [
          { id: "branch-sh", code: "BR-SHA", name: "上海分公司", manager: "吴航", phone: "13800030001", parentId: "region-yangtze", status: "启用", remark: "上海港口与机场口岸" },
          { id: "branch-sz", code: "BR-SZX", name: "深圳分公司", manager: "何川", phone: "13800030002", parentId: "region-gba", status: "启用", remark: "华南跨境电商履约" }
        ],
        warehouses: [
          { id: "wh-ningbo", code: "WH-NGB", name: "宁波保税仓", manager: "赵祺", phone: "13800040001", city: "宁波", capacity: "12000", parentId: "platform", status: "启用", remark: "海运出口集拼仓" },
          { id: "wh-la", code: "WH-LAX", name: "洛杉矶海外仓", manager: "Alice Chen", phone: "13800040002", city: "Los Angeles", capacity: "8600", parentId: "platform", status: "启用", remark: "美西尾程分拨" }
        ],
        departments: [
          { id: "dept-customs", code: "DP-CUS", name: "关务合规部", leader: "许然", phone: "13800050001", parentType: "headquarters", parentId: "hq-east", status: "启用", remark: "清关资料与报关协同" },
          { id: "dept-air", code: "DP-AIR", name: "空运操作部", leader: "李知", phone: "13800050002", parentType: "branches", parentId: "branch-sz", status: "启用", remark: "空运订舱、预配与异常跟进" },
          { id: "dept-warehouse", code: "DP-WH", name: "仓储作业部", leader: "王沐", phone: "13800050003", parentType: "warehouses", parentId: "wh-ningbo", status: "启用", remark: "入库、分拣、出库与库存准确率" }
        ],
        teams: [
          { id: "team-doc", code: "TM-DOC", name: "单证小组", leader: "宋乔", phone: "13800060001", parentId: "dept-customs", status: "启用", remark: "提单、箱单、发票校对" },
          { id: "team-track", code: "TM-TRK", name: "轨迹跟踪小组", leader: "郑远", phone: "13800060002", parentId: "dept-air", status: "启用", remark: "航班节点与客户通知" }
        ]
      },
      roles: [
        { id: "role-admin", code: "ROLE_ADMIN", name: "平台管理员", scope: "全部数据", status: "启用", permissions: allPermissions() },
        { id: "role-ops", code: "ROLE_OPS", name: "运营主管", scope: "所属组织及下级", status: "启用", permissions: limitedPermissions("home", "employees", "hq", "region", "branch", "warehouse", "department", "team") },
        { id: "role-audit", code: "ROLE_AUDIT", name: "审批专员", scope: "本人数据", status: "停用", permissions: limitedPermissions("home") }
      ],
      employees: [
        { id: "emp-001", name: "许然", account: "xuran", mobile: "13810001001", email: "xuran@hyd-logistics.com", orgId: "dept-customs", roleIds: ["role-ops"], status: "启用", lastLogin: "2026-04-30 09:18" },
        { id: "emp-002", name: "宋乔", account: "songqiao", mobile: "13810001002", email: "songqiao@hyd-logistics.com", orgId: "team-doc", roleIds: ["role-audit"], status: "启用", lastLogin: "2026-04-29 18:42" },
        { id: "emp-003", name: "吴航", account: "wuhang", mobile: "13810001003", email: "wuhang@hyd-logistics.com", orgId: "dept-air", roleIds: ["role-admin"], status: "启用", lastLogin: "2026-04-30 08:36" }
      ],
      reference: {}
    }
  };

  const qs = (selector, scope = document) => scope.querySelector(selector);
  const qsa = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const uid = (prefix) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const escapeHtml = (value = "") => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function currentOrgOption() {
    return accountOrgOptions.find((item) => item.id === state.currentOrgId) || accountOrgOptions[0];
  }

  function orgSwitcherHtml() {
    const current = currentOrgOption();
    return `
      <div class="admin-org-switcher" id="adminOrgSwitcher">
        <button class="admin-org-trigger" type="button" id="adminOrgTrigger" aria-haspopup="menu" aria-expanded="false" title="${escapeHtml(current.label)}">
          <span class="admin-org-icon" aria-hidden="true">
            <svg viewBox="0 0 1024 1024" focusable="false">
              <path d="M960 704h-63.616v-167.392a32 32 0 0 0-32-32H544V416h160a32 32 0 0 0 32-32V96a32 32 0 0 0-32-32H320a32 32 0 0 0-32 32v288a32 32 0 0 0 32 32h160v88.608H161.984a32 32 0 0 0-32 31.968L129.792 704H64a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32v-192a32 32 0 0 0-32-32H193.792l0.16-135.392H480V704h-64a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32v-192a32 32 0 0 0-32-32h-64v-135.392h288.384V704H768a32 32 0 0 0-32 32v192a32 32 0 0 0 32 32h192a32 32 0 0 0 32-32v-192a32 32 0 0 0-32-32zM352 128h320v224H352V128zM224 896H96v-128h128v128z m352 0h-128v-128h128v128z m352 0h-128v-128h128v128z"></path>
            </svg>
          </span>
          <span class="admin-org-path" id="adminOrgPath">${escapeHtml(current.label)}</span>
          <span class="admin-user-arrow">▾</span>
        </button>
        <div class="admin-org-dropdown" id="adminOrgDropdown" role="menu" hidden>
          ${accountOrgOptions.map((item) => `
            <button class="${item.id === state.currentOrgId ? "is-active" : ""}" type="button" role="menuitem" data-org-option="${escapeHtml(item.id)}">
              <span>${escapeHtml(item.label)}</span>
              <em>${escapeHtml(item.scope)}</em>
            </button>
          `).join("")}
        </div>
      </div>
    `;
  }

  function adminUserIconSvg() {
    return `
      <svg class="admin-user-icon" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M593.826203 967.947361c-8.068959 16.527029-17.325733 33.852763-33.852762 41.921722-12.103438 6.041479-26.213876 5.652367-39.935202 5.652367l-54.00468-1.228776c-3.235775 0-6.451071 0-9.277254-1.597408-3.624888-2.027479-6.041479-5.652367-8.458071-9.686846-14.52003-24.9851-29.040059-50.379792-36.289834-78.600668-4.034479-15.318734-5.631887-31.047059-6.860663-46.775385l-14.49955-145.937561c16.117438-2.007 32.255355-4.423592 48.372793-6.451071a298.428591 298.428591 0 0 1 32.644467-3.215296c11.304734-0.409592 22.588988 0 33.873242 0.409592 4.444071 0 9.277254 0.409592 13.721326 0.409592 20.541029 0.798704 41.102538 1.597408 61.664047 2.805704 16.137917 0.819184 34.262355 2.416592 44.747905 14.52003 8.47855 10.075958 9.686846 24.575508 10.075958 37.47765 0.819184 22.9781 1.617888 46.775384-6.041479 68.545189-4.444071 12.49255-11.284254 23.776804-13.721326 36.678946-1.187816 7.659367-0.798704 15.728325-1.187816 23.797285-1.228775 21.360213-11.284254 41.51213-20.971101 61.274934z" fill="#AEB8D1"></path>
        <path d="M377.787004 823.648167v2.068439l2.047959-2.047959z" fill="#A5B0C7"></path>
        <path d="M397.918442 515.614648h228.552229v218.926821H397.918442z" fill="#D3AA6F"></path>
        <path d="M359.212016 479.734405c10.055479 30.637467 40.303834 53.226455 72.559189 54.434752 2.416592-2.027479 0.798704-5.652367-0.819184-8.068959-27.811284-41.532609-58.448751-81.836443-77.412852-127.792644 2.437071 27.01258-2.805704 55.233455 5.652367 81.426851z m335.803844-7.659367a93.632687 93.632687 0 0 1-31.047059 53.226456c-2.826183 2.416592-5.631887 4.423592-9.256775 5.242775-5.652367 1.208296-11.693846-1.638367-16.137917-5.242775-8.867663-7.270255-14.52003-18.144917-17.325734-29.429171-2.826183-11.304734-3.235775-22.9781-4.034479-34.671947-0.409592-7.270255-0.409592-14.52003-0.819184-22.179396-0.409592-6.451071-0.409592-13.311734 2.437071-18.943622 4.833183-9.686846 16.117438-13.721326 26.602988-16.936621a112.228155 112.228155 0 0 1 20.151917-4.423591c5.652367-0.409592 11.673367 0.409592 15.728326 4.013999 5.631887 5.242775 5.242775 14.130917 4.833183 21.769805-0.409592 10.48555-0.409592 20.971101 0.819184 31.456651 0.389112 3.215296 0.798704 6.840183 3.604408 8.458071 1.228775 0.819184 3.235775 1.228775 4.034479 2.416591 0.819184 2.027479 0.819184 3.624888 0.409592 5.242775z" fill="#312C29"></path>
        <path d="M636.239435 383.664647c-4.136877 22.670907-2.293714 44.645507 4.853663 57.670526 7.126897 13.025019 18.472591 15.072979 29.736365 5.427092 11.263775-9.666367 20.766305-29.593008 24.882703-52.263915 4.136877-22.670907 2.293714-44.645507-4.853663-57.670527-7.126897-13.00454-18.472591-15.072979-29.736365-5.406611-11.263775 9.645887-20.766305 29.572529-24.882703 52.243435zM340.780384 391.651687c2.007 22.937141 9.604928 43.662487 19.926642 54.332353 10.321714 10.649387 21.790284 9.666367 30.104998-2.621387 8.335193-12.287754 12.205836-34.0166 10.198836-56.974221-2.007-22.957621-9.604928-43.682966-19.926642-54.352833-10.321714-10.649387-21.790284-9.666367-30.104998 2.641867-8.335193 12.287754-12.205836 33.99612-10.198836 56.974221z" fill="#D3AA6F"></path>
        <path d="M367.260495 390.648187c0 82.532749 27.586008 158.778264 72.374872 200.044639 44.768385 41.266375 99.940401 41.266375 144.708786 0 44.788864-41.266375 72.374873-117.51189 72.374873-200.044639s-27.586008-158.798744-72.374873-200.065119c-44.768385-41.245895-99.940401-41.245895-144.708786 0-44.788864 41.266375-72.374873 117.532369-72.374872 200.065119z" fill="#FFDFAD"></path>
        <path d="M384.197116 175.776324c16.117438-6.061959 35.470651 0.798704 46.754905 13.700846 11.693846 12.902142 16.936621 30.227875 18.554509 47.574089 1.617888 17.325733 0 34.671947 0 52.01816 0 8.458071 0.409592 16.916142-1.228776 25.394692-2.805704 16.117438-12.082958 30.227875-21.360212 43.519129-6.041479 9.277254-12.902142 18.964101-22.978101 23.797284-15.707846 7.659367-36.658467 0.409592-46.345313-14.520029-8.47855-13.311734-9.686846-29.838763-10.075958-45.546609-1.228775-31.845763-2.027479-63.691526 4.013999-95.148177 4.444071-20.561509 12.902142-43.539609 32.664947-50.789385z" fill="#FFDFAD"></path>
        <path d="M398.307554 138.278194c-1.617888 2.826183-2.826183 5.652367-5.652367 6.860663-2.007 0.798704-4.423592 0.798704-6.840183 0.798704-10.096438 0.409592-19.353213 6.860663-25.804284 14.909142-13.721326 16.527029-19.353213 38.296834-23.387692 59.267935-6.041479 30.227875-10.075958 60.47623-8.458071 91.113697 1.597408 30.637467 9.256775 61.274935 25.394692 87.079219 10.874663 2.416592 15.707846 15.728325 19.353213 15.728325 2.805704-8.47855 0-47.98368-3.235776-73.378372-0.819184-5.652367-1.617888-11.693846 0.409592-16.936621 2.826183-8.867663 12.49255-14.909142 14.52003-24.186397 1.208296-6.041479-1.228775-12.082958-1.228776-18.144917-0.409592-10.874663 6.061959-21.360213 6.061959-32.644467 0.409592-12.082958-6.451071-25.804284 1.597408-34.671946 6.061959 22.158917 14.929621 45.956201 34.671947 58.039159 11.693846 7.270255 26.213876 9.277254 39.935201 10.096438 31.436171 1.597408 64.101118-2.027479 93.50981 8.458071-6.451071-14.130917-23.776804-18.554509-39.116018-21.360213 10.50603 3.215296 20.971101 6.840183 31.866243 8.867663 14.909142 2.805704 30.637467 2.805704 45.546609 6.041479 14.929621 2.826183 30.248355 8.867663 39.914722 20.9711a48.782384 48.782384 0 0 0-28.630468-25.804284c13.311734-0.819184 25.804284 8.867663 31.456651 20.950621 5.631887 12.082958 5.631887 26.213876 2.826184 39.116018-2.027479 9.666367-4.853663 19.742325-2.416592 29.429171 2.805704 10.48555 12.082958 19.353213 10.465071 30.227876 6.451071 0.409592 12.082958-4.423592 14.929621-10.075959 3.215296-5.652367 4.034479-12.082958 6.041479-18.144917 2.826183-8.867663 6.860663-16.936621 10.485551-25.394692 12.49255-33.054059 8.048479-69.733005 3.624887-104.814544-3.624888-27.422172-7.659367-56.441751-24.9851-77.822443-4.444071-5.631887-10.096438-10.465071-15.339213-15.707846-20.151917-18.144917-40.713426-35.880242-64.51071-48.782384-23.756325-12.49255-51.198976-20.151917-78.191076-16.52703a167.441131 167.441131 0 0 0-31.04706 8.068959c-29.01958 9.666367-59.657047 22.158917-73.767484 48.372792z" fill="#312C29"></path>
        <path d="M460.381192 760.734865l33.463651 37.477651h34.671947l30.227875-37.477651-22.568509-35.880242h-43.949201z" fill="#1F1E24"></path>
        <path d="M399.106258 605.52005S379.363933 639.782404 511.98976 725.653327c0 0-55.643047 49.191976-72.559189 87.877922-16.936621 39.116018-14.130917 29.429171-14.130917 29.429172l-49.151017-160.846703c0.389112 0-2.047959-70.552189 22.957621-76.593668z m225.767005 0s19.742325 34.262355-112.883503 120.133277c0 0 55.643047 49.191976 72.559189 87.877922 16.936621 39.116018 14.130917 29.429171 14.130917 29.429172l49.151017-160.846703c-0.389112 0 2.047959-70.552189-22.95762-76.593668z" fill="#CBD1E4"></path>
        <path d="M391.037299 1009.459491c-32.644467-67.726005-56.032159-122.549869-56.032159-122.549869l41.532609-63.691526 0.409592-0.819184h-0.409592l-50.379792 6.061959s-12.103438-19.353213-12.103438-82.655627c0-29.818284 16.916142-61.664047 34.671946-86.669627-51.198976 16.936621-220.933821 75.385372-238.669146 104.404952-4.034479 6.451071-9.666367 21.769805-16.936621 43.150497 70.552189 99.98136 175.776324 173.339253 297.916601 202.768425z m306.784265-181.408212l-50.789385-6.041479 41.942202 64.51071s-22.9781 55.212976-56.03216 122.938981c122.140277-29.429171 227.364413-103.196656 297.50701-202.768425-6.860663-21.380692-12.902142-36.699426-16.936621-43.150497-17.735325-29.01958-187.449691-87.468331-238.648667-104.404952 17.735325 24.9851 34.671947 56.441751 34.671946 86.669627 0.409592 62.892822-11.693846 82.246035-11.693846 82.246035z" fill="#736868"></path>
        <path d="M511.98976 1023.97952c9.666367 0 19.353213-0.409592 29.01958-0.819183 6.860663-21.749325 12.902142-42.720426 18.964101-62.462751l-31.04706-162.48507h-34.671946l-27.422172 170.123957c5.242775 17.346213 10.895142 35.49113 16.52703 54.844343 9.277254 0.409592 18.964101 0.798704 28.630467 0.798704z" fill="#1F1E24"></path>
        <path d="M326.137477 828.051279l50.379793-6.041479h0.409591l-0.409591 0.819183-41.51213 64.101118s22.9781 55.212976 56.032159 122.938982c29.838763 7.249775 60.47623 11.673367 91.932882 13.721325-6.061959-18.964101-11.304734-37.49813-16.52703-54.844343-30.637467-101.98836-49.191976-175.366733-60.885822-227.774004-24.575508-111.675206-16.527029-128.202236-16.52703-128.202236s-20.561509 19.353213-40.303834 46.775384c-17.755805 24.9851-34.671947 56.441751-34.671946 86.669627 0 62.48323 12.082958 81.836443 12.082958 81.836443z m306.784265 181.408212c32.664947-67.726005 56.052639-122.959461 56.052639-122.959461l-41.942202-64.51071 50.789385 6.061959s12.103438-19.353213 12.103437-82.635147c0-29.838763-16.916142-61.684526-34.671946-86.690107-19.742325-27.401692-40.303834-46.754905-40.303834-46.754904s7.659367 15.318734-13.311734 114.48091c-10.874663 51.608568-29.818284 126.604828-61.664046 233.835963-5.652367 19.742325-12.103438 40.303834-18.964101 62.462751a463.719366 463.719366 0 0 0 91.932881-13.291254z" fill="#5C4E4E"></path>
      </svg>
    `;
  }

  function init() {
    root.innerHTML = `
      <header class="admin-topbar">
        <div class="admin-brand">
          <div class="admin-brand-mark">HYD</div>
          <div><strong>华洋达物流</strong><span>系统管理平台</span></div>
        </div>
        <div class="admin-top-center">
          <div class="admin-breadcrumb" id="adminBreadcrumb">系统管理 / <b>首页</b></div>
          <div class="global-menu-search" id="globalMenuSearch">
            <span class="global-search-icon" aria-hidden="true">
              <svg viewBox="0 0 1024 1024" focusable="false">
                <path d="M198.6 876.2c-13.6 0-26.3-5.3-35.9-14.9-19.8-19.8-19.8-52.1 0-71.9l221.9-221.9c3.9-3.9 9.1-6 14.5-6s10.6 2.1 14.5 6l42.8 42.8c3.9 3.9 6 9.1 6 14.6s-2.2 10.7-6 14.5L234.6 861.3c-9.6 9.6-22.4 14.9-36 14.9z" fill="#FCC66F"></path>
                <path d="M350.6 737.9c-4.6 0-9.2-1.8-12.7-5.3l-46.4-46.4c-7-7-7-18.4 0-25.5l79.6-79.6c3.5-3.5 8.1-5.3 12.7-5.3s9.2 1.8 12.7 5.3l46.4 46.4c7 7 7 18.4 0 25.5l-79.6 79.6c-3.5 3.5-8.1 5.3-12.7 5.3z" fill="#F56E73"></path>
                <path d="M582.3 735.5c-78.5 0-152.3-30.6-207.8-86.1-114.6-114.6-114.6-301 0-415.6 55.5-55.5 129.3-86.1 207.8-86.1s152.3 30.6 207.8 86.1c55.5 55.5 86.1 129.3 86.1 207.8s-30.6 152.3-86.1 207.8-129.3 86.1-207.8 86.1z" fill="#97DCFF"></path>
                <path d="M802.8 221.2c-58.9-58.9-137.2-91.3-220.5-91.3s-161.6 32.4-220.5 91.3c-58.9 58.9-91.3 137.2-91.3 220.5 0 59.8 16.8 117.1 48.1 166.4L278.7 648 150 776.7c-26.8 26.8-26.8 70.5 0 97.4 13 13 30.3 20.2 48.7 20.2s35.7-7.2 48.7-20.2L416 705.5c49.3 31.3 106.6 48.1 166.4 48.1 83.3 0 161.6-32.4 220.5-91.3 58.9-58.9 91.3-137.2 91.3-220.5s-32.5-161.7-91.4-220.6zM221.9 848.6c-6.4 6.4-14.8 9.6-23.2 9.6-8.4 0-16.8-3.2-23.2-9.6-12.8-12.8-12.8-33.6 0-46.4L278.7 699l46.4 46.4-103.2 103.2z m128.7-128.7l-46.4-46.4 35.7-35.7c6.9 8.5 14.2 16.6 22 24.5 7.8 7.8 16 15.1 24.5 22l-35.8 35.6z m426.8-83.2c-53.9 53.9-124.5 80.8-195.1 80.8s-141.2-26.9-195.1-80.8c-107.7-107.7-107.7-282.4 0-390.1 53.9-53.9 124.5-80.8 195.1-80.8s141.2 26.9 195.1 80.8c107.7 107.7 107.7 282.4 0 390.1z" fill="#453B56"></path>
                <path d="M483.2 273.6c74.8-44.2 172.7-34.1 237 30.1 76.2 76.2 76.2 199.7 0 275.8s-199.7 76.2-275.8 0c-53.1-53.1-69.2-129.2-48.2-196.3" fill="#97DCFF"></path>
                <path d="M582.3 654.6c-54.6 0-109.1-20.8-150.7-62.3-56.3-56.3-76.4-138.4-52.7-214.4 3-9.5 13.1-14.8 22.5-11.8s14.8 13.1 11.8 22.5c-19.7 63.2-3 131.4 43.8 178.2 69 69 181.4 69 250.4 0s69-181.4 0-250.4C650.2 259.3 561.8 248 492.3 289c-8.5 5.1-19.6 2.2-24.7-6.3-5.1-8.6-2.2-19.6 6.3-24.7 83.6-49.4 190.1-35.9 258.9 32.9 40.2 40.2 62.4 93.7 62.4 150.7s-22 110.5-62.2 150.7c-41.6 41.6-96.1 62.3-150.7 62.3z" fill="#453B56"></path>
                <path d="M444.4 303.7m-18 0a18 18 0 1 0 36 0 18 18 0 1 0-36 0Z" fill="#453B56"></path>
              </svg>
            </span>
            <input id="globalMenuInput" type="search" placeholder="搜索菜单，回车快速打开" autocomplete="off" aria-label="全局菜单搜索">
            <div class="global-menu-results" id="globalMenuResults" hidden></div>
          </div>
        </div>
        <div class="admin-actions">
          ${orgSwitcherHtml()}
          <button class="admin-icon-btn admin-fullscreen-btn" type="button" data-admin-action="fullscreen" title="进入全屏" aria-label="进入全屏">
            <svg class="admin-fullscreen-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 9V4h5"></path>
              <path d="M20 9V4h-5"></path>
              <path d="M4 15v5h5"></path>
              <path d="M20 15v5h-5"></path>
              <path d="M9 4 4 9"></path>
              <path d="m15 4 5 5"></path>
              <path d="m9 20-5-5"></path>
              <path d="m15 20 5-5"></path>
            </svg>
          </button>
          <div class="admin-user-menu" id="adminUserMenu">
            <button class="admin-user-trigger" type="button" id="adminUserTrigger" aria-haspopup="menu" aria-expanded="false">
              ${adminUserIconSvg()}
              <span>管理员 · HYD</span><span class="admin-user-arrow">▾</span>
            </button>
            <div class="admin-user-dropdown" id="adminUserDropdown" role="menu" hidden>
              <button type="button" role="menuitem" data-user-action="changePassword">修改密码</button>
              <button type="button" role="menuitem" data-user-action="resetPassword">重置密码</button>
              <button type="button" role="menuitem" data-user-action="refreshCache">刷新缓存</button>
              <button type="button" role="menuitem" data-user-action="logout">退出系统</button>
            </div>
          </div>
        </div>
      </header>
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <div class="sidebar-title">管理导航</div>
          <nav id="adminNav"></nav>
        </aside>
        <section class="admin-main" id="adminContent"></section>
      </div>
      <aside class="prd-panel" id="prdPanel" aria-label="PRD产品需求内容"></aside>
      <div class="admin-modal-backdrop" id="adminModalLayer" aria-hidden="true">
        <div class="admin-modal" role="dialog" aria-modal="true" aria-labelledby="adminModalTitle">
          <div class="modal-head">
            <h3 id="adminModalTitle"></h3>
            <button class="admin-btn" type="button" data-modal-close>关闭</button>
          </div>
          <div class="modal-body" id="adminModalBody"></div>
          <div class="modal-foot" id="adminModalFoot"></div>
        </div>
      </div>
      <div class="admin-toast" id="adminToast" role="status" aria-live="polite">
        <strong>操作成功</strong>
        <span>已完成。</span>
      </div>
      <div class="tab-context-menu" id="tabContextMenu" hidden>
        <button type="button" data-tab-action="current">关闭当前</button>
        <button type="button" data-tab-action="other">关闭其他</button>
        <button type="button" data-tab-action="left">关闭左侧</button>
        <button type="button" data-tab-action="right">关闭右侧</button>
        <button type="button" data-tab-action="all">关闭所有</button>
      </div>
    `;

    bindGlobalMenuSearch();
    qs('[data-admin-action="fullscreen"]').addEventListener("click", toggleFullscreen);
    document.addEventListener("fullscreenchange", updateFullscreenButton);
    updateFullscreenButton();
    qs("#adminOrgTrigger").addEventListener("click", (event) => {
      event.stopPropagation();
      toggleOrgMenu();
    });
    qsa("[data-org-option]").forEach((button) => {
      button.addEventListener("click", () => switchAccountOrg(button.dataset.orgOption));
    });
    qs("#adminUserTrigger").addEventListener("click", (event) => {
      event.stopPropagation();
      toggleUserMenu();
    });
    qsa("[data-user-action]").forEach((button) => {
      button.addEventListener("click", () => handleUserAction(button.dataset.userAction));
    });
    qs("#tabContextMenu").addEventListener("click", (event) => {
      const button = event.target.closest("[data-tab-action]");
      if (!button || button.disabled) return;
      handleTabContextAction(button.dataset.tabAction);
    });
    qs("#adminModalLayer").addEventListener("click", (event) => {
      if (event.target.id === "adminModalLayer" || event.target.hasAttribute("data-modal-close")) closeModal();
    });
    document.addEventListener("click", (event) => {
      if (root.hidden || event.target.closest("#tabContextMenu") || event.target.closest(".page-tab")) return;
      hideTabContextMenu();
    });
    document.addEventListener("click", (event) => {
      if (root.hidden || event.target.closest("#adminUserMenu")) return;
      hideUserMenu();
    });
    document.addEventListener("click", (event) => {
      if (root.hidden || event.target.closest("#adminOrgSwitcher")) return;
      hideOrgMenu();
    });
    document.addEventListener("click", (event) => {
      if (root.hidden || event.target.closest("#globalMenuSearch")) return;
      hideGlobalMenuResults();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        hideTabContextMenu();
        hideUserMenu();
        hideOrgMenu();
      }
    });
    document.addEventListener("keydown", handleCopyShortcut);
    document.addEventListener("copy", handleCopyEvent);
    document.addEventListener("mouseup", () => {
      state.isCellDragging = false;
    });
    expandSampleData();
    renderNav();
    renderPage();
  }

  function enter(method = "account") {
    state.entryMethod = method;
    state.active = "home";
    state.openTabs = ["home"];
    state.expanded = new Set();
    clearSelection();
    state.pagination = {};
    loginPage.hidden = true;
    root.hidden = false;
    document.documentElement.classList.add("admin-mode");
    document.body.classList.add("admin-mode");
    renderNav();
    renderPage();
    showToast("登录成功", "已进入系统管理页面，默认展示首页工作台。");
  }

  function leave() {
    root.hidden = true;
    loginPage.hidden = false;
    document.documentElement.classList.remove("admin-mode", "admin-page-scroll", "admin-page-locked");
    document.body.classList.remove("admin-mode", "admin-page-scroll", "admin-page-locked");
    showToast("已退出", "已返回登录页面。");
  }

  function toggleOrgMenu() {
    const menu = qs("#adminOrgDropdown");
    const trigger = qs("#adminOrgTrigger");
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    trigger.setAttribute("aria-expanded", String(willOpen));
    hideUserMenu();
  }

  function hideOrgMenu() {
    const menu = qs("#adminOrgDropdown");
    const trigger = qs("#adminOrgTrigger");
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    trigger?.setAttribute("aria-expanded", "false");
  }

  function switchAccountOrg(id) {
    const selected = accountOrgOptions.find((item) => item.id === id);
    if (!selected) return;
    state.currentOrgId = id;
    updateOrgSwitcher();
    hideOrgMenu();
    showToast("组织权限已切换", `当前数据范围：${selected.scope}`);
  }

  function updateOrgSwitcher() {
    const current = currentOrgOption();
    const path = qs("#adminOrgPath");
    const trigger = qs("#adminOrgTrigger");
    if (path) path.textContent = current.label;
    if (trigger) trigger.title = current.label;
    qsa("[data-org-option]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.orgOption === current.id);
    });
  }

  function bindGlobalMenuSearch() {
    const input = qs("#globalMenuInput");
    const results = qs("#globalMenuResults");
    if (!input || !results) return;
    updateGlobalSearchTitle(input);
    input.addEventListener("input", () => {
      updateGlobalSearchTitle(input);
      renderGlobalMenuResults(input.value);
    });
    input.addEventListener("focus", () => renderGlobalMenuResults(input.value));
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        const first = qs("[data-global-menu]", results);
        if (first) {
          event.preventDefault();
          openGlobalMenu(first.dataset.globalMenu);
        }
      }
      if (event.key === "Escape") hideGlobalMenuResults();
    });
    results.addEventListener("mousedown", (event) => {
      const item = event.target.closest("[data-global-menu]");
      if (!item) return;
      event.preventDefault();
      openGlobalMenu(item.dataset.globalMenu);
    });
  }

  function globalMenuCandidates() {
    return flattenMenuLeaves(nav).map((item) => ({
      id: item.id,
      label: item.label,
      path: findNavPath(item.id).join(" / ")
    }));
  }

  function flattenMenuLeaves(items) {
    return items.flatMap((item) => item.children ? flattenMenuLeaves(item.children) : [item]);
  }

  function renderGlobalMenuResults(keyword = "") {
    const results = qs("#globalMenuResults");
    if (!results) return;
    const term = keyword.trim().toLowerCase();
    const candidates = globalMenuCandidates()
      .filter((item) => !term || `${item.label} ${item.path}`.toLowerCase().includes(term))
      .slice(0, 10);
    results.innerHTML = candidates.length ? candidates.map((item) => `
      <button type="button" data-global-menu="${escapeHtml(item.id)}">
        <strong>${escapeHtml(item.label)}</strong>
        <span>${escapeHtml(item.path)}</span>
      </button>
    `).join("") : `<div class="global-menu-empty">未找到匹配菜单</div>`;
    results.hidden = false;
  }

  function hideGlobalMenuResults() {
    const results = qs("#globalMenuResults");
    if (results) results.hidden = true;
  }

  function updateGlobalSearchTitle(input = qs("#globalMenuInput")) {
    if (!input) return;
    input.title = input.value.trim() || input.placeholder || "全局菜单搜索";
  }

  function toggleFullscreen() {
    if (!document.fullscreenEnabled) {
      showToast("无法进入全屏", "当前浏览器或运行环境不支持全屏功能。");
      return;
    }
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => showToast("退出全屏失败", "浏览器未完成全屏状态切换。"));
      return;
    }
    document.documentElement.requestFullscreen().catch(() => showToast("进入全屏失败", "请允许浏览器全屏权限后重试。"));
  }

  function updateFullscreenButton() {
    const button = qs('[data-admin-action="fullscreen"]');
    if (!button) return;
    const active = Boolean(document.fullscreenElement);
    const label = active ? "退出全屏" : "进入全屏";
    button.classList.toggle("is-active", active);
    button.title = label;
    button.setAttribute("aria-label", label);
  }

  function openGlobalMenu(id) {
    const input = qs("#globalMenuInput");
    if (input) {
      input.value = "";
      updateGlobalSearchTitle(input);
      input.blur();
    }
    hideGlobalMenuResults();
    activatePage(id);
  }

  function toggleUserMenu() {
    const menu = qs("#adminUserDropdown");
    const trigger = qs("#adminUserTrigger");
    const willOpen = menu.hidden;
    menu.hidden = !willOpen;
    trigger.setAttribute("aria-expanded", String(willOpen));
    hideOrgMenu();
  }

  function hideUserMenu() {
    const menu = qs("#adminUserDropdown");
    const trigger = qs("#adminUserTrigger");
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    trigger?.setAttribute("aria-expanded", "false");
  }

  function handleUserAction(action) {
    hideUserMenu();
    if (action === "changePassword") return openChangePasswordDrawer();
    if (action === "resetPassword") return showToast("重置密码", "已模拟发送密码重置确认流程。");
    if (action === "refreshCache") return showToast("缓存已刷新", "菜单、权限和页面配置缓存已重新加载。");
    if (action === "logout") return leave();
  }

  function openChangePasswordDrawer() {
    openModal("修改密码", `
      <div class="form-grid">
        ${passwordField("当前密码", "oldPassword", "请输入当前密码")}
        ${passwordField("新密码", "newPassword", "请输入新密码")}
        ${passwordField("确认新密码", "confirmPassword", "请再次输入新密码")}
        <div class="form-field full">
          <div class="form-tip">密码至少 6 位，建议包含字母、数字和符号。</div>
        </div>
      </div>
    `, () => {
      const values = collectForm(["oldPassword", "newPassword", "confirmPassword"]);
      const errors = {};
      if (values.oldPassword.length < 6) errors.oldPassword = "请输入至少 6 位当前密码。";
      if (values.newPassword.length < 6) errors.newPassword = "新密码至少需要 6 位。";
      if (values.confirmPassword !== values.newPassword) errors.confirmPassword = "两次输入的新密码不一致。";
      if (values.oldPassword && values.newPassword && values.oldPassword === values.newPassword) errors.newPassword = "新密码不能与当前密码相同。";
      if (showFormErrors(errors)) return false;
      showToast("密码已修改", "当前为前端原型，已完成修改密码交互反馈。");
      return true;
    });
  }

  function renderNav() {
    qs("#adminNav").innerHTML = nav.map((item) => renderNavNode(item, 1)).join("");
    qsa(".nav-item", root).forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.nav;
        const hasChildren = button.dataset.hasChildren === "true";
        if (hasChildren) {
          toggleNavExpanded(id);
          renderNav();
          return;
        }
        activatePage(id);
      });
    });
  }

  function renderNavNode(item, level) {
    const hasChildren = Array.isArray(item.children);
    const active = state.active === item.id;
    const open = state.expanded.has(item.id);
    const childHtml = hasChildren ? `<div class="nav-children">${item.children.map((child) => renderNavNode(child, level + 1)).join("")}</div>` : "";
    return `
      <div class="nav-node nav-level-${level} ${open ? "is-open" : ""}">
        <button class="nav-item ${active ? "is-active" : ""}" type="button" data-nav="${item.id}" data-has-children="${hasChildren}" title="${escapeHtml(item.label)}">
          <span class="nav-label"><span class="nav-dot"></span><span>${escapeHtml(item.label)}</span></span>
          ${hasChildren ? `<span class="nav-chevron">${open ? "收起" : "展开"}</span>` : ""}
        </button>
        ${childHtml}
      </div>
    `;
  }

  function openAncestors(id) {
    const path = findNavNodePath(id);
    state.expanded = new Set(path.slice(0, -1).filter((node) => node.children).map((node) => node.id));
  }

  function toggleNavExpanded(id) {
    if (state.expanded.has(id)) {
      state.expanded.delete(id);
      closeDescendantNav(id);
      return;
    }
    const path = findNavNodePath(id);
    state.expanded = new Set(path.filter((node) => node.children).map((node) => node.id));
  }

  function closeDescendantNav(id) {
    const node = findNavNode(id);
    if (!node?.children) return;
    node.children.forEach((child) => {
      state.expanded.delete(child.id);
      closeDescendantNav(child.id);
    });
  }

  function activatePage(id, syncNav = true) {
    state.active = id;
    if (!state.openTabs.includes(id)) state.openTabs.push(id);
    clearSelection();
    if (syncNav) openAncestors(id);
    renderNav();
    renderPage();
  }

  function closePageTab(id) {
    const index = state.openTabs.indexOf(id);
    if (index < 0 || id === "home") return;
    state.openTabs.splice(index, 1);
    if (state.active === id) {
      const next = state.openTabs[Math.max(0, index - 1)] || "home";
      state.active = next;
      openAncestors(next);
    }
    clearSelection();
    renderNav();
    renderPage();
  }

  function renderPage() {
    const breadcrumb = qs("#adminBreadcrumb");
    breadcrumb.innerHTML = breadcrumbHtml(state.active);
    breadcrumb.title = breadcrumbText(state.active);
    const isListView = listPageIds.has(state.active);
    root.classList.toggle("is-list-view", isListView);
    setDocumentScrollMode(false);
    qs("#adminContent").innerHTML = `
      <div class="page-tabs" id="adminPageTabs"></div>
      <div class="admin-page-view" id="adminPageView"></div>
    `;
    renderPageTabs();
    if (state.active === "home") renderHome();
    else if (state.active === "employees") renderEmployees();
    else if (state.active === "roles") renderRoles();
    else if (orgConfig[state.active]) renderOrgPage(state.active);
    else if (referenceMenuConfigs[state.active]) renderReferencePage(state.active);
    renderPrdPanel();
  }

  function renderPageTabs() {
    qs("#adminPageTabs").innerHTML = state.openTabs.map((id) => `
      <button class="page-tab ${id === state.active ? "is-active" : ""}" type="button" data-page-tab="${id}" title="${escapeHtml(findNavLabel(id) || "首页")}">
        <span>${escapeHtml(findNavLabel(id) || "首页")}</span>
        ${id !== "home" ? `<span class="page-tab-close" data-page-tab-close="${id}" aria-label="关闭${escapeHtml(findNavLabel(id))}">X</span>` : ""}
      </button>
    `).join("");
    qsa("[data-page-tab]", root).forEach((button) => {
      button.addEventListener("click", (event) => {
        const closeTarget = event.target.closest("[data-page-tab-close]");
        if (closeTarget) return closePageTab(closeTarget.dataset.pageTabClose);
        activatePage(button.dataset.pageTab);
      });
      button.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        showTabContextMenu(button.dataset.pageTab, event.clientX, event.clientY);
      });
    });
  }

  function showTabContextMenu(id, x, y) {
    const menu = qs("#tabContextMenu");
    const index = state.openTabs.indexOf(id);
    if (!menu || index < 0) return;
    state.contextTabId = id;
    const counts = {
      current: id !== "home" ? 1 : 0,
      other: state.openTabs.filter((tab) => tab !== id && tab !== "home").length,
      left: state.openTabs.slice(0, index).filter((tab) => tab !== "home").length,
      right: state.openTabs.slice(index + 1).filter((tab) => tab !== "home").length,
      all: state.openTabs.filter((tab) => tab !== "home").length
    };
    qsa("[data-tab-action]", menu).forEach((button) => {
      button.disabled = counts[button.dataset.tabAction] === 0;
    });
    menu.hidden = false;
    const rect = menu.getBoundingClientRect();
    const left = Math.max(8, Math.min(x, window.innerWidth - rect.width - 8));
    const top = Math.max(8, Math.min(y, window.innerHeight - rect.height - 8));
    menu.style.left = `${left}px`;
    menu.style.top = `${top}px`;
  }

  function hideTabContextMenu() {
    const menu = qs("#tabContextMenu");
    if (menu) menu.hidden = true;
    state.contextTabId = "";
  }

  function handleTabContextAction(action) {
    const target = state.contextTabId;
    const tabs = [...state.openTabs];
    const index = tabs.indexOf(target);
    if (index < 0) return hideTabContextMenu();
    let nextTabs = tabs;
    let preferredActive = state.active;
    if (action === "current") {
      if (target === "home") return hideTabContextMenu();
      nextTabs = tabs.filter((id) => id !== target);
      if (state.active === target) preferredActive = tabs[Math.max(0, index - 1)] || "home";
    } else if (action === "other") {
      nextTabs = tabs.filter((id) => id === "home" || id === target);
      preferredActive = target;
    } else if (action === "left") {
      const closing = new Set(tabs.slice(0, index).filter((id) => id !== "home"));
      nextTabs = tabs.filter((id) => !closing.has(id));
      if (closing.has(state.active)) preferredActive = target;
    } else if (action === "right") {
      const closing = new Set(tabs.slice(index + 1).filter((id) => id !== "home"));
      nextTabs = tabs.filter((id) => !closing.has(id));
      if (closing.has(state.active)) preferredActive = target;
    } else if (action === "all") {
      nextTabs = ["home"];
      preferredActive = "home";
    }
    if (!nextTabs.includes("home")) nextTabs.unshift("home");
    state.openTabs = [...new Set(nextTabs)];
    state.active = state.openTabs.includes(preferredActive) ? preferredActive : state.openTabs[Math.min(index, state.openTabs.length - 1)] || "home";
    clearSelection();
    openAncestors(state.active);
    hideTabContextMenu();
    renderNav();
    renderPage();
  }

  function pageView() {
    return qs("#adminPageView") || qs("#adminContent");
  }

  function setDocumentScrollMode(allowPageScroll) {
    [document.documentElement, document.body].forEach((element) => {
      element.classList.toggle("admin-page-scroll", allowPageScroll);
      element.classList.toggle("admin-page-locked", !allowPageScroll);
    });
    if (!allowPageScroll && window.scrollY) window.scrollTo(0, 0);
  }

  function findNavLabel(id, list = nav) {
    for (const item of list) {
      if (item.id === id) return item.label;
      if (item.children) {
        const found = findNavLabel(id, item.children);
        if (found) return found;
      }
    }
    return "";
  }

  function findNavPath(id, list = nav, trail = []) {
    for (const item of list) {
      const next = [...trail, item.label];
      if (item.id === id) return next;
      if (item.children) {
        const found = findNavPath(id, item.children, next);
        if (found.length) return found;
      }
    }
    return [];
  }

  function findNavNodePath(id, list = nav, trail = []) {
    for (const item of list) {
      const next = [...trail, item];
      if (item.id === id) return next;
      if (item.children) {
        const found = findNavNodePath(id, item.children, next);
        if (found.length) return found;
      }
    }
    return [];
  }

  function findNavNode(id, list = nav) {
    for (const item of list) {
      if (item.id === id) return item;
      if (item.children) {
        const found = findNavNode(id, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  function breadcrumbHtml(id) {
    const path = ["系统管理", ...(findNavPath(id).length ? findNavPath(id) : ["首页"])];
    return path.map((item, index) => index === path.length - 1 ? `<b>${item}</b>` : item).join(" / ");
  }

  function breadcrumbText(id) {
    return ["系统管理", ...(findNavPath(id).length ? findNavPath(id) : ["首页"])].join(" / ");
  }

  function pageDescription(type) {
    const descriptions = {
      employees: "维护员工档案、登录账号、组织归属与角色授权，支撑后台权限分配。",
      roles: "按菜单、按钮和列表字段配置角色权限，控制不同岗位的可见与可操作范围。",
      hq: "维护平台下的总部层级，作为大区、部门等组织数据的上级节点。",
      region: "维护总部下的大区组织，承载区域经营、客户履约与下级分公司管理。",
      branch: "维护大区下的分公司组织，关联本地运营团队和部门层级。",
      warehouse: "维护平台仓库资料，支持仓储作业、库存归属和部门挂载。",
      department: "维护总部、大区、分公司或仓库下的部门层级，作为员工归属的核心节点。",
      team: "维护部门下的小组层级，用于细化员工、岗位和业务协同范围。"
    };
    if (descriptions[type]) return descriptions[type];
    const config = referenceMenuConfigs[type];
    if (config) return `${config.category}模块用于维护${config.label}相关业务数据，支持查询、处理和导出等日常操作。`;
    return "维护当前菜单的业务数据、状态流转和日常操作记录。";
  }

  function renderPrdPanel() {
    const panel = qs("#prdPanel");
    if (!panel) return;
    const spec = buildPrdSpec(state.active);
    panel.innerHTML = `
      <div class="prd-head">
        <span class="prd-eyebrow">PRD 产品需求</span>
        <h2>${escapeHtml(spec.title)}</h2>
        <p>${escapeHtml(spec.path)}</p>
      </div>
      <div class="prd-scroll">
        ${prdSection("对应PRD板块", `
          <div class="prd-kv"><span>页面类型</span><b>${escapeHtml(spec.pageType)}</b></div>
          <div class="prd-kv"><span>所属模块</span><b>${escapeHtml(spec.module)}</b></div>
          <div class="prd-kv"><span>原型范围</span><b>前端静态交互，不连接后端，刷新后不保留临时数据。</b></div>
        `)}
        ${prdSection("菜单背景及目的", `<p>${escapeHtml(spec.purpose)}</p>`)}
        ${prdSection("菜单用户及场景", prdList(spec.scenarios))}
        ${prdSection("筛选条件字段", prdTagList(spec.filters))}
        ${prdSection("按钮与交互逻辑", prdActionList(spec.actions, spec.type))}
        ${prdSection("列头字段", prdTagList(spec.columns))}
        ${prdSection("特殊字段取值与交互", prdSpecialFieldList(spec.specialFields))}
        ${prdSection("其他特殊逻辑", prdLogicList(spec.specialLogic))}
        ${prdSection("验收关注", prdList(spec.acceptance))}
      </div>
    `;
  }

  function buildPrdSpec(type) {
    const pathParts = ["系统管理", ...(findNavPath(type).length ? findNavPath(type) : ["首页"])];
    const title = findNavLabel(type) || "首页";
    const module = pathParts.slice(1, -1).join(" / ") || "系统首页";
    return {
      type,
      title,
      path: pathParts.join(" / "),
      module,
      pageType: prdPageType(type),
      purpose: prdPurpose(type),
      scenarios: prdScenarios(type),
      filters: prdFilters(type),
      actions: prdActions(type),
      columns: prdColumns(type),
      specialFields: prdSpecialFields(type),
      specialLogic: prdSpecialLogic(type),
      acceptance: prdAcceptance(type)
    };
  }

  function prdPageType(type) {
    if (type === "home") return "经营数据看板";
    if (type === "roles") return "权限配置列表页";
    if (type === "employees") return "员工账号管理列表页";
    if (orgConfig[type]) return "组织架构维护列表页";
    if (referenceMenuConfigs[type]) return `${referenceMenuConfigs[type].category}业务列表页`;
    return "业务操作列表页";
  }

  function prdPurpose(type) {
    if (type === "home") return "首页用于集中呈现客户风险、业务量、渠道分布、国际线路、待办审批和未处理消息，帮助运营人员快速判断今日重点事项。";
    if (type === "employees") return "员工管理用于维护员工基础资料、登录账号、组织归属和角色授权，保证人员数据与权限数据一致。";
    if (type === "roles") return "角色管理用于配置菜单、按钮和列表字段权限，是系统功能权限控制的核心入口。";
    if (orgConfig[type]) return `${orgConfig[type].title}用于维护华洋达跨境物流平台下的${orgConfig[type].singular}层级，确保员工归属、数据权限和业务组织口径统一。`;
    const config = referenceMenuConfigs[type];
    if (config) return `${config.label}用于承载${config.category}模块下的日常业务数据维护，围绕查询、处理、状态流转和导出形成标准列表工作台。`;
    return pageDescription(type);
  }

  function prdScenarios(type) {
    if (type === "home") return ["管理者查看经营概览并按今日、本周、本月、本年切换统计周期。", "审批人从首页进入我的审批，快速处理待审批事项。", "业务人员从首页进入我的消息，查看未处理提醒与异常。"];
    if (type === "employees") return ["系统管理员创建或维护员工账号。", "权限管理员按组织和角色筛选员工，检查账号状态。", "部门主管确认员工归属到部门或小组后再分配角色权限。"];
    if (type === "roles") return ["权限管理员新增角色并配置菜单、按钮、字段权限。", "运维人员查看角色覆盖范围，判断权限是否过宽。", "管理员停用不再使用的角色，避免历史权限继续生效。"];
    if (orgConfig[type]) return ["组织管理员维护组织层级数据。", "新增数据时从左侧组织树选择上级节点并自动带入表单。", "运营团队按组织节点筛选下级数据，确认业务归属。"];
    if (type === "myApproval") return ["审批人筛选待审批、已审批、抄送、已发起事项。", "审批人对选中事项执行通过、不通过、转审或查看详情。", "发起人查看审批流程和当前所属节点。"];
    if (type === "myMessage") return ["处理人筛选待处理、已处理、抄送、已发起消息。", "处理人将待办标记为已处理或不处理。", "相关人员查看消息流程、字段信息和抄送范围。"];
    const config = referenceMenuConfigs[type];
    const category = config?.category || "业务";
    return [`${category}人员按筛选条件定位目标数据。`, "操作人员勾选列表数据后执行对应按钮操作。", "管理人员导出列表结果用于线下核对或运营分析。"];
  }

  function prdFilters(type) {
    if (type === "home") return ["统计周期：今日、本周、本月、本年"];
    if (type === "employees") return ["员工编号", "姓名", "登录账号", "手机号", "邮箱", "组织归属", "角色权限", "状态"];
    if (type === "roles") return ["角色编码", "角色名称", "数据范围", "包含菜单", "状态"];
    if (orgConfig[type]) return orgFilters(type).map((item) => item.label);
    if (referenceMenuConfigs[type]) {
      const normal = referenceFilters(referenceMenuConfigs[type]).map((item) => item.label);
      const statusOptions = statusBarOptions(type);
      return statusOptions ? [`横向状态栏：${statusOptions.map((item) => item[1]).join("、")}`, ...normal] : normal;
    }
    return [];
  }

  function prdActions(type) {
    if (type === "home") {
      return [
        { op: "range", label: "统计周期切换" },
        { op: "approvalMore", label: "我的审批-更多" },
        { op: "messageMore", label: "我的消息-更多" }
      ];
    }
    return actionButtons(type).map(({ op, label }) => ({ op, label }));
  }

  function prdColumns(type) {
    if (type === "home") {
      return [
        "指标卡：30天未下单客户、已锁定客户、待对账客户、已到账期运单",
        "我的审批：事项、发起人、发起时间、状态",
        "我的消息：事项、发起人、发起时间、状态",
        "图表：客户数据、业务量、业务分布、国际线路订单统计"
      ];
    }
    if (type === "employees") return ["员工编号", "姓名", "登录账号", "手机号", "邮箱", "组织归属", "角色权限", "状态", "最近登录"];
    if (type === "roles") return ["角色编码", "角色名称", "数据范围", "菜单权限", "按钮权限", "字段权限", "状态"];
    if (orgConfig[type]) return orgColumns(type).map((item) => item.label);
    if (referenceMenuConfigs[type]) return referenceColumns(referenceMenuConfigs[type]).map((item) => item.label);
    return [];
  }

  function prdSpecialFields(type) {
    if (type === "home") {
      return [
        prdField("统计周期", "今日、本周、本月、本年切换后，首页指标卡和图表读取同一周期模拟数据。", "点击分段按钮即时刷新所有首页统计展示。"),
        prdField("审批与消息", "首页仅展示待审批或未处理数据，最近 3 条优先展示。", "点击更多打开对应菜单页签。")
      ];
    }
    if (type === "employees") {
      return [
        prdField("组织归属", "员工必须关联部门或小组层级，用于数据权限和组织树筛选。", "新增或编辑抽屉中通过下拉选择组织。"),
        prdField("角色权限", "员工通过关联角色获取菜单、按钮和列表字段权限。", "列表展示角色名称集合，筛选支持按角色定位员工。"),
        prdField("状态", "启用表示账号可用，停用表示账号不可登录或不可参与授权。", "启用、停用按钮需先勾选数据。")
      ];
    }
    if (type === "roles") {
      return [
        prdField("数据范围", "角色支持全部数据、所属组织及下级、本人数据三类范围。", "新增或编辑时选择数据范围，影响后续数据权限口径。"),
        prdField("菜单权限", "按系统完整菜单树逐项配置是否可见。", "点击左侧菜单节点，右侧独立配置按钮和字段。"),
        prdField("按钮权限 / 字段权限", "每个菜单的按钮和列表字段单独勾选，不与其他菜单联动。", "全选只作用于当前选中菜单下的按钮和字段。")
      ];
    }
    if (orgConfig[type]) {
      const config = orgConfig[type];
      const items = [
        prdField("上级层级", `${config.singular}按组织规则挂载到允许的上级节点，平台层级为系统内置。`, "从左侧组织树选择节点后，点击新增自动带入上级关系。"),
        prdField("状态", "启用表示组织可被业务引用，停用表示不建议继续新增下级或员工归属。", "启用、停用按钮批量修改选中数据。")
      ];
      if (type === "department") items.unshift(prdField("上级类型", "部门可挂载到总部、大区、分公司或仓库。", "筛选和新增表单均需要先明确上级类型。"));
      if (type === "warehouse") items.unshift(prdField("仓储容量", "记录仓库可用容量，供仓储资源和库存预警参考。", "列表以 m³ 展示，筛选支持容量文本匹配。"));
      return items;
    }
    if (type === "myApproval") {
      return [
        prdField("横向状态栏", "状态栏使用内部状态：待审批、已审批、抄送、已发起。该状态不作为列表表头展示。", "点击状态栏刷新列表并保留筛选区字段。"),
        prdField("审批状态", "审批状态取值为待审批、审批通过、审批不通过。", "状态以标签样式展示，审批通过或审批不通过后更新状态。"),
        prdField("当前节点", "展示审批流当前所属节点，例如部门主管审批、流程结束或转审至某人。", "详情抽屉中同步展示到流程节点。")
      ];
    }
    if (type === "myMessage") {
      return [
        prdField("横向状态栏", "状态栏使用内部状态：待处理、已处理、抄送、已发起。该状态不作为列表表头展示。", "点击状态栏刷新列表并保留筛选区字段。"),
        prdField("处理状态", "处理状态取值为未处理、已处理。", "已处理或不处理后均将处理状态更新为已处理。"),
        prdField("当前节点", "展示消息待办当前处理节点，例如待办处理节点或流程结束。", "详情抽屉中同步展示到消息流程。")
      ];
    }
    const config = referenceMenuConfigs[type];
    if (!config) return [];
    const fields = config.fields.filter((label) => /状态|金额|币种|计费重|重量|价格|成本|账期|权限|节点|数量/.test(label));
    const result = fields.map((label) => prdField(label, `${label}为${config.label}的关键业务字段，取值来自当前页面模拟数据或操作流转结果。`, "状态类字段以标签展示；金额、重量、数量类字段用于列表查看和导出。"));
    if (!result.length) result.push(prdField("状态", "状态用于标识数据是否可继续参与业务操作。", "启用、停用或处理类按钮触发后刷新列表标签。"));
    return result;
  }

  function prdSpecialLogic(type) {
    const listLogic = listPageIds.has(type)
      ? [
        prdLogic("列表选择", "支持复选框勾选；双击数据行可选中或取消选中当前行。"),
        prdLogic("单元格复制", "支持鼠标拖选或多选单元格后按 Ctrl+C 复制，复制内容按换行分隔。"),
        prdLogic("分页", "默认每页 10 条，支持切换每页 10、50、100 条。"),
        prdLogic("新增/编辑抽屉", "新增、编辑、详情等操作统一使用右侧向左抽出的抽屉样式。")
      ]
      : [];
    if (type === "home") {
      return [
        prdLogic("图表联动", "统计周期切换后，客户数据、业务量、业务分布、国际线路订单统计同步刷新。"),
        prdLogic("待办入口", "我的审批、我的消息卡片右上角更多按钮分别打开对应菜单页签。"),
        prdLogic("首页滚动", "首页保持内容操作区域滚动，顶部导航和左侧菜单固定。")
      ];
    }
    if (type === "roles") {
      return [
        ...listLogic,
        prdLogic("权限配置", "角色新增和编辑页面展示完整菜单树，点击菜单后配置该菜单独立的按钮权限和列表字段权限。"),
        prdLogic("全选范围", "权限配置右侧全选仅影响当前菜单的按钮与字段，不影响其他菜单。")
      ];
    }
    if (orgConfig[type]) {
      return [
        ...listLogic,
        prdLogic("组织树", "大区、分公司、仓库、部门、小组、员工管理左侧展示组织树，支持展开收起并锁定当前位置。"),
        prdLogic("组织层级规则", "平台为最高层级且内置不可调整；总部、仓库默认归属平台；部门可挂载在总部、大区、分公司或仓库下；小组挂载在部门下。")
      ];
    }
    if (type === "employees") {
      return [
        ...listLogic,
        prdLogic("组织树筛选", "左侧组织树用于按组织节点过滤员工，并在新增时默认带入选中组织。"),
        prdLogic("账号权限", "员工账号通过角色关联获取功能权限，员工必须归属部门或小组。")
      ];
    }
    if (type === "myApproval") {
      return [
        ...listLogic,
        prdLogic("审批动作", "审批通过、审批不通过、转审、详情均需先选择数据；转审会打开表单并校验转审人员和说明。"),
        prdLogic("详情展示", "详情抽屉展示字段信息和审批流程，不展示审批进度、审批详情等重复分组。")
      ];
    }
    if (type === "myMessage") {
      return [
        ...listLogic,
        prdLogic("消息动作", "已处理、不处理、详情均需先选择数据；处理后更新处理状态和当前节点。"),
        prdLogic("详情展示", "详情抽屉展示字段信息和消息流程，不展示消息待办进度或处理信息分组。")
      ];
    }
    return [
      ...listLogic,
      prdLogic("查询与导出", "查询按当前筛选区字段过滤列表；导出为前端原型反馈，不实际生成文件。"),
      prdLogic("数据范围", "当前为页面内临时数据，刷新后恢复默认模拟数据。")
    ];
  }

  function prdAcceptance(type) {
    const base = ["页面在右侧 PRD 面板打开时，主系统区域按剩余宽度展示且不变形。", "切换菜单或页签时，PRD 内容同步切换到当前菜单。"];
    if (listPageIds.has(type)) base.push("列表筛选、操作按钮、分页和复制交互保持可用。");
    if (type === "myApproval" || type === "myMessage") base.push("横向状态栏位于按钮操作区下方，且不作为表格列头。");
    return base;
  }

  function prdSection(title, content) {
    return `<section class="prd-section"><h3>${escapeHtml(title)}</h3>${content}</section>`;
  }

  function prdList(items) {
    if (!items.length) return `<p class="prd-empty">暂无特殊内容。</p>`;
    return `<ul class="prd-list">${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function prdTagList(items) {
    if (!items.length) return `<p class="prd-empty">当前页面无独立筛选或列表字段。</p>`;
    return `<div class="prd-tags">${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
  }

  function prdActionList(actions, type) {
    if (!actions.length) return `<p class="prd-empty">当前页面无按钮操作。</p>`;
    return `<div class="prd-action-list">${actions.map((action) => `
      <article>
        <b>${escapeHtml(action.label)}</b>
        <p><span>逻辑：</span>${escapeHtml(prdActionLogic(type, action.op, action.label))}</p>
        <p><span>交互：</span>${escapeHtml(prdActionInteraction(action.op, action.label))}</p>
      </article>
    `).join("")}</div>`;
  }

  function prdSpecialFieldList(items) {
    if (!items.length) return `<p class="prd-empty">无复杂特殊字段。</p>`;
    return `<div class="prd-action-list">${items.map((item) => `
      <article>
        <b>${escapeHtml(item.name)}</b>
        <p><span>取值逻辑：</span>${escapeHtml(item.logic)}</p>
        <p><span>交互：</span>${escapeHtml(item.interaction)}</p>
      </article>
    `).join("")}</div>`;
  }

  function prdLogicList(items) {
    return `<div class="prd-action-list">${items.map((item) => `
      <article>
        <b>${escapeHtml(item.category)}</b>
        <p>${escapeHtml(item.description)}</p>
      </article>
    `).join("")}</div>`;
  }

  function prdField(name, logic, interaction) {
    return { name, logic, interaction };
  }

  function prdLogic(category, description) {
    return { category, description };
  }

  function prdActionLogic(type, op, label) {
    const custom = {
      range: "按所选统计周期读取首页模拟数据并刷新指标卡、表格和图表。",
      approvalMore: "打开我的审批菜单页签，定位到审批列表。",
      messageMore: "打开我的消息菜单页签，定位到消息列表。",
      query: "读取筛选条件和横向状态栏，过滤当前列表并回到第 1 页。",
      add: "创建当前菜单的新数据，按表单校验后写入页面临时数据。",
      edit: "编辑当前选中的单条数据，保存后刷新列表。",
      delete: "删除选中的数据；组织类数据如存在下级节点则阻止删除。",
      enable: "将选中数据状态批量更新为启用。",
      disable: "将选中数据状态批量更新为停用。",
      export: "模拟导出当前列表结果。",
      approve: type === "myApproval" ? "将审批状态更新为审批通过，状态栏归入已审批。" : "执行审核通过类处理。",
      reject: type === "myApproval" ? "将审批状态更新为审批不通过，状态栏归入已审批。" : "执行驳回类处理。",
      transfer: "将当前审批节点转给指定人员继续处理。",
      detail: "打开详情抽屉查看字段信息和流程。",
      handled: "将消息处理状态更新为已处理。",
      ignore: "将消息标记为不处理，并归入已处理状态。",
      assign: "将业务数据分派给负责人或处理人。",
      close: "关闭当前业务处理事项。",
      review: "对选中数据执行复核确认。",
      print: "模拟打印当前选中批次或单据。",
      download: "模拟下载当前选中批次或文件。",
      reconcile: "对财务或账单数据执行对账处理。",
      submit: "提交当前业务单据进入下一节点。",
      import: "模拟导入批次数据。",
      refresh: "刷新当前页面展示数据。"
    };
    return custom[op] || `${label}按钮用于触发${label}相关前端原型反馈。`;
  }

  function prdActionInteraction(op, label) {
    if (["add", "edit", "detail", "transfer"].includes(op)) return "点击后打开右侧抽屉；需要选择数据的按钮在未选择时保持禁用或提示。";
    if (["delete", "enable", "disable", "approve", "reject", "handled", "ignore", "assign", "close", "review", "print", "download", "reconcile", "submit"].includes(op)) return "需先勾选列表数据，点击后即时刷新列表并展示反馈提示。";
    if (op === "query") return "点击查询或在筛选框按 Enter 后刷新列表；清空 X 可重置单个筛选条件。";
    if (op === "export") return "点击后展示导出任务反馈，不下载真实文件。";
    if (op === "range") return "点击分段按钮后选中态切换，首页所有统计组件同步刷新。";
    if (op === "approvalMore" || op === "messageMore") return "点击更多按钮后打开对应菜单页签。";
    return `点击${label}后展示前端原型反馈。`;
  }

  function renderHome() {
    const data = homeData()[state.homeRange];
    const stats = data.stats;
    pageView().innerHTML = `
      <div class="page-head">
        <div>
          <h1>首页</h1>
          <p>围绕客户、业务量、渠道分布和国际线路生成经营看板。</p>
        </div>
        <div class="time-segment" aria-label="首页统计周期">
          ${[
            ["today", "今日"],
            ["week", "本周"],
            ["month", "本月"],
            ["year", "本年"]
          ].map(([value, label]) => `<button class="${state.homeRange === value ? "is-active" : ""}" type="button" data-home-range="${value}">${label}</button>`).join("")}
        </div>
      </div>
      <div class="stats-grid">
        ${stats.map(([name, value, trend]) => `<div class="admin-card stat-card"><span>${name}</span><strong>${value}</strong><em>${trend}</em></div>`).join("")}
      </div>
      <div class="approval-message-grid">
        ${homeMiniTable("我的审批", [
          ["价格审批", "林岚", "2026-04-30 09:18", "待审批"],
          ["账期调整", "陈越", "2026-04-30 10:06", "待审批"],
          ["异常减免", "周宁", "2026-04-29 17:40", "待审批"]
        ], "myApproval")}
        ${homeMiniTable("我的消息", [
          ["客户30天未下单提醒", "系统", "2026-04-30 08:30", "未处理"],
          ["美西渠道价格波动", "渠道运营部", "2026-04-30 09:44", "未处理"],
          ["海外仓库存预警", "仓储作业部", "2026-04-29 18:22", "未处理"]
        ], "myMessage")}
      </div>
      <div class="home-chart-grid">
        <div class="admin-card">
          <div class="card-head"><h2>客户数据</h2><span>${rangeText()}客户状态变化</span></div>
          <div class="customer-chart">
            ${data.customers.map((item) => customerPoint(item)).join("")}
          </div>
        </div>
        <div class="admin-card">
          <div class="card-head"><h2>业务量</h2><span>计费重 / 营业额</span></div>
          <div class="volume-chart">
            ${data.volume.map((item) => volumeGroup(item)).join("")}
          </div>
        </div>
        <div class="admin-card distribution-card">
          <div class="card-head"><h2>业务分布</h2><span>渠道占比</span></div>
          <div class="distribution-wrap">
            <div class="donut-chart" style="${donutStyle(data.distribution)}"><span>${data.distribution.reduce((sum, item) => sum + item.value, 0)}</span></div>
            <div class="legend-list">
              ${data.distribution.map((item, index) => `<div><i style="background:${donutColors[index]}"></i><span>${item.name}</span><b>${item.value}%</b></div>`).join("")}
            </div>
          </div>
        </div>
        <div class="admin-card line-card">
          <div class="card-head"><h2>国际线路订单统计</h2><span>${rangeText()}计划出运量</span></div>
          <div class="chart-bars">
            ${data.routes.map((item) => bar(item.name, item.percent, item.value)).join("")}
          </div>
        </div>
      </div>
    `;
    qsa("[data-home-range]", root).forEach((button) => {
      button.addEventListener("click", () => {
        state.homeRange = button.dataset.homeRange;
        renderHome();
      });
    });
    qsa("[data-home-more]", root).forEach((button) => {
      button.addEventListener("click", () => activatePage(button.dataset.homeMore));
    });
  }

  function bar(name, width, value) {
    return `<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar-fill" style="width:${width}%"></div></div><strong>${value}</strong></div>`;
  }

  const donutColors = ["#ff8a1d", "#6bb7ff", "#53d39b", "#8f7cff", "#f6c85f"];

  function homeData() {
    return {
      today: homeDataSet([12, 8, 24, 36], [18, 26, 15, 9], [24, 18, 16, 22, 20], 1),
      week: homeDataSet([68, 31, 142, 218], [42, 58, 34, 28], [22, 20, 18, 24, 16], 1.4),
      month: homeDataSet([286, 96, 618, 1240], [76, 118, 84, 52], [26, 21, 19, 20, 14], 2.1),
      year: homeDataSet([2680, 428, 5206, 13860], [210, 460, 338, 186], [30, 24, 18, 16, 12], 3.3)
    };
  }

  function homeDataSet(statsValues, customers, distribution, factor) {
    return {
      stats: [
        ["30天未下单客户", statsValues[0], "需客户成功团队跟进"],
        ["已锁定客户", statsValues[1], "风控或账期策略锁定"],
        ["待对账客户", statsValues[2], "账单待确认"],
        ["已到账期运单", statsValues[3], "需关注回款进度"]
      ],
      customers: [
        { name: "新增客户", value: customers[0], percent: Math.min(96, customers[0]) },
        { name: "跟进客户", value: customers[1], percent: Math.min(96, customers[1]) },
        { name: "开户客户", value: customers[2], percent: Math.min(96, customers[2]) },
        { name: "流失客户", value: customers[3], percent: Math.min(96, customers[3]) }
      ],
      volume: [
        { name: "美线", weight: Math.round(42 * factor), revenue: Math.round(68 * factor) },
        { name: "欧线", weight: Math.round(36 * factor), revenue: Math.round(52 * factor) },
        { name: "东南亚", weight: Math.round(28 * factor), revenue: Math.round(41 * factor) },
        { name: "海外仓", weight: Math.round(24 * factor), revenue: Math.round(37 * factor) }
      ],
      distribution: [
        { name: "UPS快递", value: distribution[0] },
        { name: "Fedex快递", value: distribution[1] },
        { name: "FBA卡派", value: distribution[2] },
        { name: "私人卡派", value: distribution[3] },
        { name: "自提", value: distribution[4] }
      ],
      routes: [
        { name: "中国-美国", percent: 88, value: Math.round(1248 * factor) },
        { name: "中国-欧洲", percent: 76, value: Math.round(932 * factor) },
        { name: "中国-东南亚", percent: 64, value: Math.round(806 * factor) },
        { name: "中国-中东", percent: 52, value: Math.round(436 * factor) },
        { name: "海外仓调拨", percent: 42, value: Math.round(312 * factor) }
      ]
    };
  }

  function rangeText() {
    return ({ today: "今日", week: "本周", month: "本月", year: "本年" })[state.homeRange];
  }

  function customerPoint(item) {
    return `
      <div class="customer-point">
        <div class="customer-bar"><span style="height:${Math.max(14, item.percent)}%"></span></div>
        <strong>${item.value}</strong>
        <em>${item.name}</em>
      </div>
    `;
  }

  function volumeGroup(item) {
    const max = Math.max(item.weight, item.revenue, 1);
    return `
      <div class="volume-group">
        <span>${item.name}</span>
        <div class="volume-bars">
          <i style="height:${Math.max(12, item.weight / max * 86)}%"></i>
          <b style="height:${Math.max(12, item.revenue / max * 86)}%"></b>
        </div>
        <small>${item.weight}t / ${item.revenue}万</small>
      </div>
    `;
  }

  function donutStyle(items) {
    let cursor = 0;
    const segments = items.map((item, index) => {
      const start = cursor;
      cursor += item.value;
      return `${donutColors[index]} ${start}% ${cursor}%`;
    });
    return `background: conic-gradient(${segments.join(", ")});`;
  }

  function activity(title, copy, status) {
    return `<div class="activity-item"><span class="activity-dot"></span><div><strong>${title}</strong><span>${copy}</span></div><span class="status-pill">${status}</span></div>`;
  }

  function homeMiniTable(title, rows, targetId) {
    return `
      <div class="admin-card mini-table-card">
        <div class="card-head">
          <h2>${title}</h2>
          <button class="mini-more-btn" type="button" data-home-more="${targetId}">更多</button>
        </div>
        <table class="mini-table">
          <thead><tr><th>事项</th><th>发起人</th><th>发起时间</th><th>状态</th></tr></thead>
          <tbody>
            ${rows.map((row) => `<tr>${row.map((cell, index) => `<td>${index === 3 ? pill(cell) : escapeHtml(cell)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  function renderEmployees() {
    const filters = getFilters("employees");
    const rows = state.data.employees.filter((row) => {
      return likeOrAll(filters.id, row.id)
        && likeOrAll(filters.name, row.name)
        && likeOrAll(filters.account, row.account)
        && likeOrAll(filters.mobile, row.mobile)
        && likeOrAll(filters.email, row.email)
        && exactOrAll(filters.status, row.status)
        && exactOrAll(filters.orgId, row.orgId)
        && (!filters.roleId || row.roleIds.includes(filters.roleId));
    });
    const columns = [
      col("id", "员工编号"),
      col("name", "姓名"),
      col("account", "登录账号"),
      col("mobile", "手机号"),
      col("email", "邮箱"),
      col("org", "组织归属", (row) => orgName(row.orgId)),
      col("roles", "角色权限", (row) => roleNames(row.roleIds)),
      col("status", "状态", (row) => pill(row.status), true),
      col("lastLogin", "最近登录")
    ];
    renderListPage({
      type: "employees",
      title: "员工管理",
      desc: pageDescription("employees"),
      rows,
      columns,
      filters: [
        inputFilter("id", "员工编号", "请输入员工编号"),
        inputFilter("name", "姓名", "请输入姓名"),
        inputFilter("account", "登录账号", "请输入登录账号"),
        inputFilter("mobile", "手机号", "请输入手机号"),
        inputFilter("email", "邮箱", "请输入邮箱"),
        selectFilter("orgId", "组织归属", [["", "全部组织"], ...selectableEmployeeOrgs().map((item) => [item.id, `${item.name}（${item.type}）`])]),
        selectFilter("roleId", "角色权限", [["", "全部角色"], ...state.data.roles.map((item) => [item.id, item.name])]),
        statusFilter()
      ]
    });
  }

  function renderRoles() {
    const filters = getFilters("roles");
    const rows = state.data.roles.filter((row) => {
      return likeOrAll(filters.code, row.code)
        && likeOrAll(filters.name, row.name)
        && exactOrAll(filters.status, row.status)
        && exactOrAll(filters.scope, row.scope)
        && (!filters.menuId || Boolean(row.permissions?.[filters.menuId]?.enabled));
    });
    const columns = [
      col("code", "角色编码"),
      col("name", "角色名称"),
      col("scope", "数据范围"),
      col("menuCount", "菜单权限", (row) => `${permissionStats(row).menuCount} 项`),
      col("buttonCount", "按钮权限", (row) => `${permissionStats(row).buttonCount} 项`),
      col("fieldCount", "字段权限", (row) => `${permissionStats(row).fieldCount} 项`),
      col("status", "状态", (row) => pill(row.status), true)
    ];
    renderListPage({
      type: "roles",
      title: "角色管理",
      desc: pageDescription("roles"),
      rows,
      columns,
      filters: [
        inputFilter("code", "角色编码", "请输入角色编码"),
        inputFilter("name", "角色名称", "请输入角色名称"),
        selectFilter("scope", "数据范围", [["", "全部范围"], ["全部数据", "全部数据"], ["所属组织及下级", "所属组织及下级"], ["本人数据", "本人数据"]]),
        selectFilter("menuId", "包含菜单", [["", "全部菜单"], ...permissionMenus.map((item) => [item.id, item.label])]),
        statusFilter()
      ]
    });
  }

  function renderOrgPage(type) {
    const config = orgConfig[type];
    const filters = getFilters(type);
    const rows = orgRows(type).filter((row) => {
      return likeOrAll(filters.code, row.code)
        && likeOrAll(filters.name, row.name)
        && likeOrAll(filters.manager, row.manager || row.leader)
        && likeOrAll(filters.phone, row.phone)
        && likeOrAll(filters.city, row.city)
        && likeOrAll(filters.capacity, row.capacity)
        && exactOrAll(filters.status, row.status)
        && exactOrAll(filters.parentId, row.parentId)
        && exactOrAll(filters.parentType, row.parentType);
    });
    renderListPage({
      type,
      title: config.title,
      desc: pageDescription(type),
      rows,
      columns: orgColumns(type),
      filters: orgFilters(type)
    });
  }

  function renderReferencePage(type) {
    const config = referenceMenuConfigs[type];
    const filters = getFilters(type);
    const rows = referenceRows(type).filter((row) => {
      return Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        if (key === "status") return exactOrAll(value, row.status);
        return likeOrAll(value, row[key]);
      });
    });
    renderListPage({
      type,
      title: config.label,
      desc: pageDescription(type),
      rows,
      columns: referenceColumns(config),
      filters: referenceFilters(config)
    });
  }

  function renderListPage({ type, title, desc, rows, columns, filters }) {
    const pager = getPager(type, rows.length);
    const pageRows = rows.slice((pager.page - 1) * pager.pageSize, pager.page * pager.pageSize);
    const treePanel = orgTreePageIds.has(type) ? orgTreePanel(type) : "";
    pageView().innerHTML = `
      <div class="list-page">
        <div class="page-head">
          <div><h1>${title}</h1><p>${desc}</p></div>
        </div>
        <div class="list-body ${treePanel ? "has-org-tree" : ""}">
          ${treePanel}
          <div class="list-content-area">
            ${operationPanel(type, filters)}
            <div class="admin-card table-card">
              <table class="admin-table" data-table-type="${type}">
                <thead>
                  <tr>
                    <th class="select-col"><input type="checkbox" data-select-all aria-label="全选"></th>
                    ${columns.map((column) => `<th title="${escapeHtml(column.label)}"><span class="table-head-label">${escapeHtml(column.label)}</span></th>`).join("")}
                  </tr>
                </thead>
                <tbody>
                  ${pageRows.length ? pageRows.map((row, index) => tableRow(type, row, columns, (pager.page - 1) * pager.pageSize + index)).join("") : `<tr><td colspan="${columns.length + 1}"><div class="empty-state">暂无匹配数据</div></td></tr>`}
                </tbody>
              </table>
            </div>
            ${paginationHtml(type, pager, rows.length)}
          </div>
        </div>
      </div>
    `;
    bindListEvents(type);
    refreshActionState();
    restoreOrgTreeAnchor(type);
  }

  function operationPanel(type, filters) {
    const actions = actionButtons(type);
    const expandable = filters.length > 4;
    const expanded = state.filterExpanded.has(type);
    return `
      <div class="admin-card ops-panel">
        <div class="ops-title-row">
          <div class="ops-title">筛选与操作</div>
          ${expandable ? `<button class="filter-toggle" type="button" data-filter-toggle>${expanded ? "收起筛选" : "展开筛选"}</button>` : ""}
        </div>
        <div class="filter-grid ${expandable ? "is-filter-limited" : ""} ${expanded ? "is-expanded" : ""}">
          ${filters.map((filter) => renderFilter(type, filter)).join("")}
        </div>
        <div class="action-row">
          ${actions.map((action) => `<button class="admin-btn ${action.className}" type="button" data-op="${action.op}" ${action.requiresSelection ? "data-requires-selection disabled" : ""} ${action.op === "edit" ? "disabled" : ""}>${action.label}</button>`).join("")}
        </div>
        ${statusFilterBar(type)}
      </div>
    `;
  }

  function renderFilter(type, filter) {
    const value = getFilters(type)[filter.name] || "";
    if (filter.kind === "select") {
      return `
        <label class="filter-field">
          <span class="filter-label">${filter.label}</span>
          <span class="filter-control">
            <select class="admin-select" data-filter="${filter.name}">
              ${filter.options.map(([optionValue, optionLabel]) => `<option value="${escapeHtml(optionValue)}" ${optionValue === value ? "selected" : ""}>${escapeHtml(optionLabel)}</option>`).join("")}
            </select>
            <button class="filter-clear" type="button" data-filter-clear="${filter.name}" aria-label="清空${escapeHtml(filter.label)}">X</button>
          </span>
        </label>
      `;
    }
    return `
      <label class="filter-field">
        <span class="filter-label">${filter.label}</span>
        <span class="filter-control">
          <input class="admin-input" data-filter="${filter.name}" value="${escapeHtml(value)}" placeholder="${escapeHtml(filter.placeholder || "")}">
          <button class="filter-clear" type="button" data-filter-clear="${filter.name}" aria-label="清空${escapeHtml(filter.label)}">X</button>
        </span>
      </label>
    `;
  }

  function getPager(type, total) {
    if (!state.pagination[type]) state.pagination[type] = { page: 1, pageSize: 10 };
    const pager = state.pagination[type];
    if (![10, 50, 100].includes(Number(pager.pageSize))) pager.pageSize = 10;
    const pageCount = Math.max(1, Math.ceil(total / pager.pageSize));
    if (pager.page > pageCount) pager.page = pageCount;
    if (pager.page < 1) pager.page = 1;
    return { ...pager, pageCount };
  }

  function setPage(type, page, shouldRender = true) {
    if (!state.pagination[type]) state.pagination[type] = { page: 1, pageSize: 10 };
    state.pagination[type].page = page;
    clearSelection();
    if (shouldRender) renderPage();
  }

  function setPageSize(type, pageSize) {
    if (!state.pagination[type]) state.pagination[type] = { page: 1, pageSize: 10 };
    state.pagination[type].pageSize = [10, 50, 100].includes(pageSize) ? pageSize : 10;
    state.pagination[type].page = 1;
    clearSelection();
    renderPage();
  }

  function paginationHtml(type, pager, total) {
    const pages = pageNumbers(pager.page, pager.pageCount);
    const start = total ? (pager.page - 1) * pager.pageSize + 1 : 0;
    const end = Math.min(total, pager.page * pager.pageSize);
    return `
      <div class="admin-card pagination-bar">
        <div class="pagination-info">
          <span>共 ${total} 条，当前 ${start}-${end} 条</span>
          <select class="admin-select page-size-select" data-page-size aria-label="每页条数">
            ${[10, 50, 100].map((size) => `<option value="${size}" ${pager.pageSize === size ? "selected" : ""}>每页 ${size} 条</option>`).join("")}
          </select>
        </div>
        <div class="pagination-actions">
          <button class="admin-btn" type="button" data-page="${pager.page - 1}" ${pager.page <= 1 ? "disabled" : ""}>上一页</button>
          ${pages.map((page) => `<button class="admin-btn page-btn ${page === pager.page ? "is-active" : ""}" type="button" data-page="${page}">${page}</button>`).join("")}
          <button class="admin-btn" type="button" data-page="${pager.page + 1}" ${pager.page >= pager.pageCount ? "disabled" : ""}>下一页</button>
        </div>
      </div>
    `;
  }

  function pageNumbers(current, total) {
    const start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    const adjustedStart = Math.max(1, end - 4);
    const pages = [];
    for (let page = adjustedStart; page <= end; page += 1) pages.push(page);
    return pages;
  }

  function bindListEvents(type) {
    qs("[data-filter-toggle]", root)?.addEventListener("click", () => {
      if (state.filterExpanded.has(type)) state.filterExpanded.delete(type);
      else state.filterExpanded.add(type);
      renderPage();
    });
    qsa("[data-status-filter]", root).forEach((button) => {
      button.addEventListener("click", () => {
        const filters = getFilters(type);
        filters.status = button.dataset.statusFilter;
        clearSelection();
        setPage(type, 1, false);
        renderPage();
      });
    });
    qsa("[data-op]", root).forEach((button) => {
      button.addEventListener("click", () => handleOperation(type, button.dataset.op));
    });
    qsa("[data-filter]", root).forEach((input) => {
      input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") handleOperation(type, "query");
      });
    });
    qsa("[data-filter-clear]", root).forEach((button) => {
      button.addEventListener("click", () => {
        const field = qs(`[data-filter="${button.dataset.filterClear}"]`, root);
        if (!field) return;
        field.value = "";
        collectFilters(type);
        clearSelection();
        setPage(type, 1, false);
        renderPage();
      });
    });
    qsa("[data-org-tree-toggle]", root).forEach((button) => {
      button.addEventListener("click", () => {
        const id = button.dataset.orgTreeToggle;
        captureOrgTreeAnchor(type, button);
        if (state.orgTreeExpanded.has(id)) state.orgTreeExpanded.delete(id);
        else state.orgTreeExpanded.add(id);
        renderPage();
      });
    });
    qsa("[data-org-tree-select]", root).forEach((button) => {
      button.addEventListener("click", () => {
        captureOrgTreeAnchor(type, button);
        state.orgTreeSelection[type] = button.dataset.orgTreeSelect;
        expandOrgTreePath(buildOrgTree(type), button.dataset.orgTreeSelect);
        clearSelection();
        showToast("组织节点已选择", `${button.dataset.orgTreeLabel} 将作为新增默认归属。`);
        renderPage();
      });
    });
    qs("[data-select-all]", root)?.addEventListener("change", (event) => {
      state.selectedRows = new Set(event.target.checked ? qsa("[data-row-id]", root).map((row) => row.dataset.rowId) : []);
      renderPage();
    });
    qsa("[data-row-select]", root).forEach((checkbox) => {
      checkbox.addEventListener("change", (event) => {
        if (event.target.checked) state.selectedRows.add(event.target.value);
        else state.selectedRows.delete(event.target.value);
        event.target.closest("tr")?.classList.toggle("is-row-selected", event.target.checked);
        refreshActionState();
      });
    });
    qsa("[data-row-id]", root).forEach((row) => {
      row.addEventListener("dblclick", (event) => {
        if (event.target.matches("input, button, select, textarea")) return;
        const checkbox = qs("[data-row-select]", row);
        checkbox.checked = !checkbox.checked;
        if (checkbox.checked) state.selectedRows.add(row.dataset.rowId);
        else state.selectedRows.delete(row.dataset.rowId);
        row.classList.toggle("is-row-selected", checkbox.checked);
        refreshActionState();
      });
    });
    qsa("[data-copy-cell]", root).forEach((cell) => {
      cell.addEventListener("mousedown", (event) => {
        event.preventDefault();
        const key = cell.dataset.cellKey;
        state.isCellDragging = true;
        state.dragMode = state.selectedCells.has(key) ? "remove" : "add";
        toggleCell(cell, state.dragMode);
        refreshCellSelection();
      });
      cell.addEventListener("mouseenter", () => {
        if (!state.isCellDragging) return;
        toggleCell(cell, state.dragMode);
        refreshCellSelection();
      });
      cell.addEventListener("focus", () => {
        if (!state.selectedCells.has(cell.dataset.cellKey)) {
          clearCellSelection();
          addCell(cell);
          refreshCellSelection();
        }
      });
    });
    qsa("[data-page]", root).forEach((button) => {
      button.addEventListener("click", () => {
        setPage(type, Number(button.dataset.page));
      });
    });
    qsa("[data-page-size]", root).forEach((select) => {
      select.addEventListener("change", () => {
        setPageSize(type, Number(select.value));
      });
    });
  }

  function handleOperation(type, op) {
    if (op === "query") {
      collectFilters(type);
      clearSelection();
      setPage(type, 1, false);
      renderPage();
      return;
    }
    if (op === "add") return openEditor(type, "create");
    if (op === "edit") {
      const ids = selectedIds();
      if (ids.length !== 1) return showToast("请选择一条数据", "编辑操作需要且仅需要选择一条数据。");
      return openEditor(type, "edit", ids[0]);
    }
    if (op === "delete") return deleteSelected(type);
    if (op === "enable" || op === "disable") return updateSelectedStatus(type, op === "enable" ? "启用" : "停用");
    if (op === "export") return showToast("导出任务已创建", "当前为前端原型，已模拟生成导出任务。");
    return handleReferenceOperation(type, op);
  }

  function handleReferenceOperation(type, op) {
    const config = referenceMenuConfigs[type];
    if (!config) return;
    if (actionRequiresSelection(op) && !selectedIds().length) {
      return showToast("请选择数据", `${actionButtonLabel(type, op)}前需要先勾选列表数据。`);
    }
    if (op === "detail") return openTodoDetail(type, selectedIds()[0]);
    if (op === "transfer") return openTransferApproval(type, selectedIds()[0]);
    if (type === "myApproval" && op === "approve") return updateTodoSelected(type, "审批通过", "已审批", "审批通过");
    if (type === "myApproval" && op === "reject") return updateTodoSelected(type, "审批不通过", "已审批", "审批不通过");
    if (type === "myMessage" && op === "handled") return updateTodoSelected(type, "已处理", "已处理", "消息已处理");
    if (type === "myMessage" && op === "ignore") return updateTodoSelected(type, "已处理", "已处理", "已标记不处理");
    showToast(`${actionButtonLabel(type, op)}已触发`, `${config.label}已完成前端原型反馈。`);
  }

  function updateTodoSelected(type, processStatus, status, title) {
    selectedIds().forEach((id) => {
      const row = findRecord(type, id);
      if (!row) return;
      row.f4 = processStatus;
      row.status = status;
      row.f6 = "流程结束";
    });
    clearSelection();
    showToast(title, "已更新选中数据的处理状态。");
    renderPage();
  }

  function openTransferApproval(type, id) {
    const row = findRecord(type, id);
    if (!row) return;
    openModal("转审", `
      <div class="form-grid transfer-form">
        <div class="form-field full">
          <label>审批事项</label>
          <input class="admin-input" value="${escapeHtml(row.f1)}" disabled>
        </div>
        ${selectField("转审人员", "transferUser", optionList(["林岚", "周宁", "陈越", "许然", "吴航", "宋乔"], ""), "选择后当前审批节点将转给该人员")}
        <div class="form-field full">
          <label>转审说明</label>
          <textarea class="admin-textarea" name="transferRemark" placeholder="请输入转审说明"></textarea>
          <div class="form-error" data-form-error="transferRemark"></div>
        </div>
      </div>
    `, () => {
      const values = collectForm(["transferUser", "transferRemark"]);
      const errors = {};
      if (!values.transferUser) errors.transferUser = "请选择转审人员。";
      if (!values.transferRemark) errors.transferRemark = "请输入转审说明。";
      if (showFormErrors(errors)) return false;
      row.f6 = `转审至 ${values.transferUser}`;
      row.status = "待审批";
      showToast("转审成功", `${row.f1} 已转给 ${values.transferUser}。`);
      renderPage();
      return true;
    });
  }

  function openTodoDetail(type, id) {
    const row = findRecord(type, id);
    if (!row) return;
    const isApproval = type === "myApproval";
    const title = isApproval ? "审批详情" : "消息详情";
    const flowTitle = isApproval ? "审批流程" : "消息流程";
    openModal(title, `
      <div class="todo-detail">
        <div class="detail-section">
          <h4>字段信息</h4>
          <div class="detail-grid">
            ${detailItem(isApproval ? "审批编号" : "消息编号", row.f0)}
            ${detailItem(isApproval ? "审批事项" : "消息事项", row.f1)}
            ${detailItem("发起人", row.f2)}
            ${detailItem("发起时间", row.f3)}
            ${detailItem(isApproval ? "审批状态" : "处理状态", row.f4)}
            ${detailItem("状态栏", row.status)}
            ${detailItem("当前所属节点", row.f6)}
            ${detailItem("抄送节点信息", row.f7)}
          </div>
        </div>
        <div class="detail-section">
          <h4>${flowTitle}</h4>
          ${todoFlowHtml(row, isApproval)}
        </div>
      </div>
    `, () => true);
    qs("#adminModalFoot").innerHTML = `<button class="admin-btn primary" type="button" data-modal-close>关闭</button>`;
    qsa("[data-modal-close]").forEach((button) => button.addEventListener("click", closeModal));
  }

  function todoFlowHtml(row, isApproval) {
    const labels = isApproval
      ? {
        doneTitle: "业务初审",
        doneStatus: "已通过",
        currentTitle: row.f6 || "复核节点",
        currentStatus: row.f4 === "待审批" ? "待审批" : row.f4,
        groupLabel: "审批组",
        actorLabel: "审批人",
        timeLabel: "处理时间",
        remarkLabel: "审批意见",
        copyTitle: "同步抄送",
        copyLabel: "抄送范围"
      }
      : {
        doneTitle: "消息创建",
        doneStatus: "已触达",
        currentTitle: row.f6 || "待办处理",
        currentStatus: row.f4 === "未处理" ? "待处理" : row.f4,
        groupLabel: "处理组",
        actorLabel: "处理人",
        timeLabel: "处理时间",
        remarkLabel: "处理说明",
        copyTitle: "同步抄送",
        copyLabel: "抄送范围"
      };
    const primaryActors = isApproval ? "张经理，李经理，王经理" : "客服主管，运营经理";
    const pendingActors = isApproval ? "孙财务，赵财务" : "仓储专员，渠道专员";
    const copyActors = row.f7 || (isApproval ? "钱客服，周客服" : "系统管理员，周客服");
    const doneRemark = isApproval ? "资料完整，进入下一节点" : "已生成待办并通知相关人员";
    return `
      <div class="flow-line">
        <div class="flow-node is-done">
          <i>01</i>
          <div class="flow-node-content">
            <div class="flow-node-head"><strong>${labels.doneTitle}</strong><span>${labels.doneStatus}</span></div>
            <div class="flow-node-list">
              <p>${labels.groupLabel}：${primaryActors}</p>
              <p>${labels.actorLabel}：${escapeHtml(row.f2 || primaryActors.split("，")[0])}</p>
              <p>${labels.timeLabel}：${escapeHtml(row.f3 || "2026-03-03 12:00:00")}</p>
              <p>${labels.remarkLabel}：${doneRemark}</p>
            </div>
          </div>
        </div>
        <div class="flow-node is-waiting">
          <i>02</i>
          <div class="flow-node-content">
            <div class="flow-node-head"><strong>${escapeHtml(labels.currentTitle)}</strong><span>${escapeHtml(labels.currentStatus)}</span></div>
            <div class="flow-node-list">
              <p>${labels.groupLabel}：${pendingActors}</p>
              <p>${labels.actorLabel}：待认领</p>
              <p>${labels.timeLabel}：-</p>
              <p>${labels.remarkLabel}：等待当前节点处理</p>
            </div>
          </div>
        </div>
        <div class="flow-node is-copy">
          <i>CC</i>
          <div class="flow-node-content">
            <div class="flow-node-head"><strong>${labels.copyTitle}</strong><span>已通知</span></div>
            <div class="flow-node-list">
              <p>${labels.copyLabel}：${escapeHtml(copyActors)}</p>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function detailItem(label, value) {
    return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(value || "-")}</strong></div>`;
  }

  function collectFilters(type) {
    const filters = {};
    qsa("[data-filter]", root).forEach((input) => {
      filters[input.dataset.filter] = input.value.trim();
    });
    const current = getFilters(type);
    if (statusBarOptions(type) && current.status) filters.status = current.status;
    state.filters[type] = filters;
  }

  function getFilters(type) {
    if (!state.filters[type]) state.filters[type] = {};
    return state.filters[type];
  }

  function clearSelection() {
    state.selectedRows.clear();
    clearCellSelection();
  }

  function refreshActionState() {
    const count = state.selectedRows.size;
    const edit = qs('[data-op="edit"]', root);
    const del = qs('[data-op="delete"]', root);
    const enable = qs('[data-op="enable"]', root);
    const disable = qs('[data-op="disable"]', root);
    if (edit) edit.disabled = count !== 1;
    if (del) del.disabled = count === 0;
    if (enable) enable.disabled = count === 0;
    if (disable) disable.disabled = count === 0;
    qsa("[data-requires-selection]", root).forEach((button) => {
      if (button.dataset.op !== "edit") button.disabled = count === 0;
    });
  }

  function clearCellSelection() {
    state.selectedCells.clear();
  }

  function addCell(cell) {
    state.selectedCells.set(cell.dataset.cellKey, cellData(cell));
  }

  function toggleCell(cell, mode) {
    if (mode === "remove") state.selectedCells.delete(cell.dataset.cellKey);
    else addCell(cell);
  }

  function cellData(cell) {
    return {
      key: cell.dataset.cellKey,
      row: Number(cell.dataset.rowIndex),
      col: Number(cell.dataset.colIndex),
      value: cell.dataset.copyValue || cell.textContent.trim()
    };
  }

  function refreshCellSelection() {
    qsa(".copy-cell", root).forEach((cell) => {
      cell.classList.toggle("is-selected", state.selectedCells.has(cell.dataset.cellKey));
    });
    refreshActionState();
  }

  function handleCopyShortcut(event) {
    if (root.hidden || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== "c") return;
    const active = document.activeElement;
    if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
    if (!state.selectedCells.size) return;
    event.preventDefault();
    copySelectedCells();
  }

  function handleCopyEvent(event) {
    if (root.hidden || !state.selectedCells.size) return;
    const active = document.activeElement;
    if (active && ["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return;
    event.preventDefault();
    const text = selectedCellsText();
    event.clipboardData?.setData("text/plain", text);
    showToast("已复制单元格", `${state.selectedCells.size} 个单元格内容已复制。`);
  }

  function copySelectedCells() {
    if (!state.selectedCells.size) return showToast("未选择单元格", "请先点击或拖选一个或多个表格单元格，再按 Ctrl+C。");
    const text = selectedCellsText();
    copyTextFallback(text);
    showToast("已复制单元格", `${state.selectedCells.size} 个单元格内容已复制。`);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
  }

  function copyTextFallback(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.left = "-9999px";
    textarea.style.top = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  function selectedCellsText() {
    const cells = [...state.selectedCells.values()].sort((a, b) => a.row - b.row || a.col - b.col);
    const rows = new Map();
    cells.forEach((cell) => {
      if (!rows.has(cell.row)) rows.set(cell.row, []);
      rows.get(cell.row).push(cell);
    });
    return cells.map((cell) => cell.value).join("\n");
  }

  function tableRow(type, row, columns, rowIndex) {
    const checked = state.selectedRows.has(row.id);
    return `
      <tr data-row-id="${row.id}" class="${checked ? "is-row-selected" : ""}">
        <td class="select-col"><input type="checkbox" data-row-select value="${row.id}" ${checked ? "checked" : ""} aria-label="选择行"></td>
        ${columns.map((column, colIndex) => {
          const raw = column.raw ? column.raw(row) : row[column.key];
          const html = column.html ? column.html(row) : escapeHtml(raw ?? "-");
          const key = `${row.id}:${column.key}`;
          const selected = state.selectedCells.has(key);
          return `<td class="copy-cell ${selected ? "is-selected" : ""}" tabindex="0" data-copy-cell data-cell-key="${escapeHtml(key)}" data-row-index="${rowIndex}" data-col-index="${colIndex}" data-copy-value="${escapeHtml(raw ?? "-")}">${html}</td>`;
        }).join("")}
      </tr>
    `;
  }

  function col(key, label, getter, isHtml = false) {
    return {
      key,
      label,
      raw: getter ? (row) => stripHtml(getter(row)) : (row) => row[key],
      html: getter ? (row) => isHtml ? getter(row) : escapeHtml(getter(row)) : null
    };
  }

  function stripHtml(value) {
    return String(value ?? "").replace(/<[^>]+>/g, "").trim();
  }

  function inputFilter(name, label, placeholder) {
    return { kind: "input", name, label, placeholder };
  }

  function selectFilter(name, label, options) {
    return { kind: "select", name, label, options };
  }

  function statusFilter() {
    return selectFilter("status", "状态", [["", "全部状态"], ["启用", "启用"], ["停用", "停用"]]);
  }

  function actionButtons(type) {
    const ops = referenceMenuConfigs[type]?.actions || ["query", "add", "edit", "delete", "enable", "disable", "export"];
    return ops.map((op) => ({
      op,
      label: actionButtonLabel(type, op),
      className: actionClass(op),
      requiresSelection: actionRequiresSelection(op)
    }));
  }

  function actionButtonLabel(type, op) {
    if (op === "add") return addLabel(type);
    if (type === "myApproval" && op === "approve") return "审批通过";
    if (type === "myApproval" && op === "reject") return "审批不通过";
    return actionLabel(op);
  }

  function actionLabelsFor(ops) {
    return ops.map((op) => op === "add" ? "新增" : actionLabel(op));
  }

  function actionLabelsForMenu(type, ops) {
    return ops.map((op) => actionButtonLabel(type, op));
  }

  function actionLabel(op) {
    return ({
      query: "查询",
      add: "新增",
      edit: "编辑",
      delete: "删除",
      enable: "启用",
      disable: "停用",
      export: "导出",
      import: "导入",
      submit: "提交",
      approve: "审核通过",
      reject: "驳回",
      transfer: "转审",
      detail: "详情",
      handled: "已处理",
      ignore: "不处理",
      assign: "分派",
      close: "关闭",
      review: "复核",
      print: "打印",
      download: "下载",
      refresh: "刷新",
      reconcile: "对账"
    }[op] || op);
  }

  function actionClass(op) {
    if (op === "add") return "primary";
    if (["delete", "reject", "ignore"].includes(op)) return "danger";
    if (["enable", "approve", "submit", "review", "close", "handled"].includes(op)) return "success";
    if (["disable", "assign", "reconcile", "transfer"].includes(op)) return "warning";
    return "";
  }

  function actionRequiresSelection(op) {
    return ["edit", "delete", "enable", "disable", "approve", "reject", "transfer", "detail", "handled", "ignore", "assign", "close", "review", "print", "download", "reconcile", "submit"].includes(op);
  }

  function exactOrAll(filterValue, value) {
    return !filterValue || filterValue === value;
  }

  function likeOrAll(filterValue, value) {
    if (!filterValue) return true;
    return String(value ?? "").toLowerCase().includes(String(filterValue).toLowerCase());
  }

  function textMatch(keyword, values) {
    if (!keyword) return true;
    const text = values.filter(Boolean).join(" ").toLowerCase();
    return text.includes(keyword.toLowerCase());
  }

  function addLabel(type) {
    if (type === "employees") return "新增员工";
    if (type === "roles") return "新增角色";
    if (referenceMenuConfigs[type]) return `新增${referenceAddName(referenceMenuConfigs[type].label)}`;
    return `新增${orgConfig[type].singular}`;
  }

  function referenceAddName(label) {
    return label
      .replace(/管理$/, "")
      .replace(/维护$/, "")
      .replace(/查询$/, "")
      .replace(/^创建/, "")
      .replace(/库$/, "")
      || label;
  }

  function selectedIds() {
    return [...state.selectedRows];
  }

  function deleteSelected(type) {
    const ids = selectedIds();
    if (!ids.length) return showToast("请选择数据", "删除前需要先勾选列表数据。");
    const blocked = ids.map((id) => deleteBlockReason(type, id)).filter(Boolean);
    if (blocked.length) return showToast("无法删除", blocked[0]);
    if (!window.confirm(`确认删除已选中的 ${ids.length} 条数据吗？`)) return;
    ids.forEach((id) => removeRecord(type, id));
    clearSelection();
    showToast("删除成功", `已删除 ${ids.length} 条临时数据。`);
    renderPage();
  }

  function updateSelectedStatus(type, status) {
    const ids = selectedIds();
    if (!ids.length) return showToast("请选择数据", "启停前需要先勾选列表数据。");
    ids.forEach((id) => { findRecord(type, id).status = status; });
    showToast("状态已更新", `已将 ${ids.length} 条数据设置为${status}。`);
    renderPage();
  }

  function openEditor(type, mode, id) {
    if (type === "employees") return openEmployeeEditor(mode, id);
    if (type === "roles") return openRoleEditor(mode, id);
    if (referenceMenuConfigs[type]) return openReferenceEditor(type, mode, id);
    return openOrgEditor(type, mode, id);
  }

  function openReferenceEditor(type, mode, id) {
    const config = referenceMenuConfigs[type];
    const current = mode === "edit" ? findRecord(type, id) : {};
    const keys = referenceEditableFields(config).map((item) => item.key);
    openModal(`${mode === "edit" ? "修改" : "新增"}${config.label}`, `
      <div class="form-grid">
        ${referenceEditableFields(config).map((item) => field(item.label, item.key, current[item.key], `请输入${item.label}`)).join("")}
        ${selectField("状态", "status", optionList(["启用", "停用"], current.status || "启用"), "")}
        <div class="form-field full">
          <label>说明</label>
          <textarea class="admin-textarea" name="remark" placeholder="补充说明">${escapeHtml(current.remark || "")}</textarea>
          <div class="form-error" data-form-error="remark"></div>
        </div>
      </div>
    `, () => {
      const values = collectForm([...keys, "status", "remark"]);
      const errors = {};
      if (!values[keys[0]]) errors[keys[0]] = `请输入${referenceEditableFields(config)[0].label}。`;
      if (showFormErrors(errors)) return false;
      if (mode === "edit") Object.assign(current, values);
      else referenceRows(type).unshift({ id: uid(type), ...values });
      clearSelection();
      showToast(`${config.label}已保存`, "列表原型数据已更新。");
      renderPage();
      return true;
    });
  }

  function openEmployeeEditor(mode, id) {
    const current = mode === "edit" ? findRecord("employees", id) : employeeDefaultsFromTree();
    const orgOptions = selectableEmployeeOrgs().map((org) => `<option value="${org.id}" ${current.orgId === org.id ? "selected" : ""}>${org.name}（${org.type}）</option>`).join("");
    const roleChecks = state.data.roles.map((role) => checkCard("roleIds", role.id, role.name, current.roleIds?.includes(role.id))).join("");
    openModal(`${mode === "edit" ? "修改" : "新增"}员工`, `
      <div class="form-grid">
        ${field("姓名", "name", current.name, "请输入员工姓名")}
        ${field("登录账号", "account", current.account, "请输入登录账号")}
        ${field("手机号", "mobile", current.mobile, "请输入手机号")}
        ${field("邮箱", "email", current.email, "请输入邮箱")}
        ${selectField("组织归属", "orgId", orgOptions, "关联部门层级或小组层级")}
        ${selectField("状态", "status", optionList(["启用", "停用"], current.status || "启用"), "")}
        <div class="form-field full">
          <label>角色权限</label>
          <div class="checkbox-grid">${roleChecks}</div>
          <div class="form-error" data-form-error="roleIds"></div>
        </div>
      </div>
    `, () => {
      const values = collectForm(["name", "account", "mobile", "email", "orgId", "status"]);
      values.roleIds = checkedValues("roleIds");
      const errors = {};
      if (!values.name) errors.name = "请输入员工姓名。";
      if (!values.account) errors.account = "请输入登录账号。";
      if (!/^1[3-9]\d{9}$/.test(values.mobile)) errors.mobile = "请输入有效手机号。";
      if (!values.email || !values.email.includes("@")) errors.email = "请输入有效邮箱。";
      if (!values.orgId) errors.orgId = "请选择部门或小组。";
      if (!values.roleIds.length) errors.roleIds = "至少选择一个角色权限。";
      if (showFormErrors(errors)) return false;
      if (mode === "edit") Object.assign(current, values);
      else state.data.employees.unshift({ id: uid("emp"), lastLogin: "-", ...values });
      clearSelection();
      showToast("员工已保存", `${values.name} 的账号与权限已更新。`);
      renderPage();
      return true;
    });
  }

  function openRoleEditor(mode, id) {
    const current = mode === "edit" ? findRecord("roles", id) : {};
    const draft = clonePermissions(current.permissions);
    let activeMenu = permissionMenus[0].id;
    const expandedPermissionNodes = new Set(["permission", "org"]);
    let pendingPermissionAnchor = null;
    openModal(`${mode === "edit" ? "修改" : "新增"}角色`, `
      <div class="form-grid">
        ${field("角色名称", "name", current.name, "请输入角色名称")}
        ${field("角色编码", "code", current.code, "例如 ROLE_CUSTOMER_SERVICE")}
        ${selectField("数据范围", "scope", optionList(["全部数据", "所属组织及下级", "本人数据"], current.scope || "所属组织及下级"), "")}
        ${selectField("状态", "status", optionList(["启用", "停用"], current.status || "启用"), "")}
        <div class="form-field full">
          <label>权限配置</label>
          <div class="permission-builder">
            <div class="permission-menu-list">
              ${permissionTreeHtml(permissionTree, activeMenu, expandedPermissionNodes)}
            </div>
            <div class="permission-detail" id="permissionDetail"></div>
          </div>
          <div class="form-error" data-form-error="permissions"></div>
        </div>
      </div>
    `, () => {
      const values = collectForm(["name", "code", "scope", "status"]);
      const errors = {};
      if (!values.name) errors.name = "请输入角色名称。";
      if (!values.code) errors.code = "请输入角色编码。";
      if (!Object.values(draft).some((item) => item.enabled)) errors.permissions = "至少启用一个菜单权限。";
      if (showFormErrors(errors)) return false;
      values.permissions = draft;
      if (mode === "edit") Object.assign(current, values);
      else state.data.roles.unshift({ id: uid("role"), ...values });
      clearSelection();
      showToast("角色已保存", `${values.name} 的菜单、按钮、字段权限已更新。`);
      renderPage();
      return true;
    });

    const renderDetail = () => {
      const menu = permissionMenus.find((item) => item.id === activeMenu);
      const permission = draft[activeMenu] || { enabled: false, buttons: [], fields: [] };
      const allChecked = menu.buttons.every((item) => permission.buttons.includes(item))
        && menu.fields.every((item) => permission.fields.includes(item));
      qs("#permissionDetail").innerHTML = `
        <div class="permission-detail-head">
          <div><strong>${menu.label}</strong><span>每个菜单的按钮权限与列表字段权限单独配置</span></div>
          <label class="switch-line"><input type="checkbox" data-permission-all ${allChecked ? "checked" : ""}>全选</label>
        </div>
        <div class="permission-columns">
          <div>
            <h4>按钮权限</h4>
            <div class="checkbox-grid">${menu.buttons.map((item) => checkCard("permButtons", item, item, permission.buttons.includes(item))).join("")}</div>
          </div>
          <div>
            <h4>列表字段权限</h4>
            <div class="checkbox-grid">${menu.fields.map((item) => checkCard("permFields", item, item, permission.fields.includes(item))).join("")}</div>
          </div>
        </div>
      `;
      const syncAllState = () => {
        const current = draft[activeMenu];
        const selectedCount = current.buttons.length + current.fields.length;
        const totalCount = menu.buttons.length + menu.fields.length;
        const allControl = qs("[data-permission-all]");
        allControl.checked = selectedCount === totalCount;
        allControl.indeterminate = selectedCount > 0 && selectedCount < totalCount;
      };
      const syncPermissionChecks = () => {
        draft[activeMenu].buttons = checkedValues("permButtons");
        draft[activeMenu].fields = checkedValues("permFields");
        draft[activeMenu].enabled = draft[activeMenu].buttons.length > 0 || draft[activeMenu].fields.length > 0;
        syncAllState();
      };
      qs("[data-permission-all]").addEventListener("change", (event) => {
        draft[activeMenu].buttons = event.target.checked ? [...menu.buttons] : [];
        draft[activeMenu].fields = event.target.checked ? [...menu.fields] : [];
        draft[activeMenu].enabled = event.target.checked;
        renderDetail();
      });
      qsa('[name="permButtons"]').forEach((input) => input.addEventListener("change", () => {
        syncPermissionChecks();
      }));
      qsa('[name="permFields"]').forEach((input) => input.addEventListener("change", () => {
        syncPermissionChecks();
      }));
    };

    const capturePermissionAnchor = (button) => {
      const list = qs(".permission-menu-list");
      const row = button.closest("[data-permission-row]");
      if (!list || !row) return;
      pendingPermissionAnchor = {
        id: row.dataset.permissionRow,
        top: row.getBoundingClientRect().top,
        scrollTop: list.scrollTop
      };
    };

    const restorePermissionAnchor = () => {
      if (!pendingPermissionAnchor) return;
      const list = qs(".permission-menu-list");
      const row = qsa("[data-permission-row]").find((item) => item.dataset.permissionRow === pendingPermissionAnchor.id);
      if (list && row) {
        list.scrollTop = pendingPermissionAnchor.scrollTop;
        list.scrollTop += row.getBoundingClientRect().top - pendingPermissionAnchor.top;
      }
      pendingPermissionAnchor = null;
    };

    const renderPermissionTree = () => {
      qs(".permission-menu-list").innerHTML = permissionTreeHtml(permissionTree, activeMenu, expandedPermissionNodes);
      bindPermissionTree();
      restorePermissionAnchor();
    };

    const bindPermissionTree = () => {
      qsa("[data-permission-toggle]").forEach((button) => {
        button.addEventListener("click", () => {
          capturePermissionAnchor(button);
          const id = button.dataset.permissionToggle;
          if (expandedPermissionNodes.has(id)) expandedPermissionNodes.delete(id);
          else expandedPermissionNodes.add(id);
          renderPermissionTree();
        });
      });
      qsa("[data-permission-menu]").forEach((button) => {
        button.addEventListener("click", () => {
          capturePermissionAnchor(button);
          activeMenu = button.dataset.permissionMenu;
          qsa("[data-permission-menu]").forEach((item) => item.classList.toggle("is-active", item.dataset.permissionMenu === activeMenu));
          renderDetail();
          restorePermissionAnchor();
        });
      });
    };
    bindPermissionTree();
    renderDetail();
  }

  function openOrgEditor(type, mode, id) {
    const config = orgConfig[type];
    const current = mode === "edit" ? findRecord(type, id) : orgDefaultsFromTree(type);
    openModal(`${mode === "edit" ? "修改" : "新增"}${config.singular}`, orgFormHtml(type, current), () => saveOrg(type, mode, current));
    if (type === "department") {
      qs('[name="parentType"]').addEventListener("change", (event) => {
        qs('[name="parentId"]').innerHTML = parentOptions(event.target.value, "");
      });
    }
  }

  function permissionTreeHtml(nodes, activeMenu, expandedNodes, level = 1) {
    return nodes.map((node) => {
      const canOpen = !node.virtual;
      const hasChildren = Boolean(node.children?.length);
      const open = hasChildren && expandedNodes.has(node.id);
      const active = canOpen && node.id === activeMenu;
      return `
        <div class="permission-tree-node permission-level-${level} ${open ? "is-open" : ""}">
          <div class="permission-tree-row" data-permission-row="${escapeHtml(node.id)}">
            <button class="permission-menu ${active ? "is-active" : ""}" type="button" ${hasChildren ? `data-permission-toggle="${escapeHtml(node.id)}"` : `data-permission-menu="${escapeHtml(node.id)}"`}>
              <span class="permission-nav-label"><span class="nav-dot"></span><span>${escapeHtml(node.label)}</span></span>
              ${hasChildren ? `<span class="permission-chevron">${open ? "收起" : "展开"}</span>` : ""}
            </button>
          </div>
          ${hasChildren && open ? `<div class="permission-tree-children">${permissionTreeHtml(node.children, activeMenu, expandedNodes, level + 1)}</div>` : ""}
        </div>
      `;
    }).join("");
  }

  function orgFormHtml(type, current) {
    const config = orgConfig[type];
    const managerName = current.manager || current.leader || "";
    const parentPart = orgParentField(type, current);
    const warehouseFields = type === "warehouse" ? `${field("所在城市", "city", current.city, "请输入城市")} ${field("仓储容量(m³)", "capacity", current.capacity, "请输入容量")}` : "";
    return `
      <div class="form-grid">
        ${parentPart}
        ${field(`${config.singular}名称`, "name", current.name, `请输入${config.singular}名称`)}
        ${field("编码", "code", current.code, "请输入唯一编码")}
        ${field(config.managerLabel, "manager", managerName, "请输入负责人")}
        ${field("联系电话", "phone", current.phone, "请输入联系电话")}
        ${warehouseFields}
        ${selectField("状态", "status", optionList(["启用", "停用"], current.status || "启用"), "")}
        <div class="form-field full">
          <label>说明</label>
          <textarea class="admin-textarea" name="remark" placeholder="补充说明">${escapeHtml(current.remark || "")}</textarea>
          <div class="form-error" data-form-error="remark"></div>
        </div>
      </div>
    `;
  }

  function orgParentField(type, current) {
    if (type === "hq" || type === "warehouse") {
      return `
        <div class="form-field full">
          <label>所属平台</label>
          <input class="admin-input" value="${platform.name}（系统内置不可调整）" disabled>
        </div>
      `;
    }
    if (type === "department") {
      const currentParentType = current.parentType || "headquarters";
      return `
        ${selectField("上级类型", "parentType", optionList(["headquarters", "regions", "branches", "warehouses"].map((key) => ({ value: key, label: parentTypeLabels[key] })), currentParentType), "")}
        ${selectField("上级层级", "parentId", parentOptions(currentParentType, current.parentId), "部门可挂在总部、大区、分公司或仓库下")}
      `;
    }
    return selectField(orgConfig[type].parentLabel, "parentId", parentOptions(orgConfig[type].parentKind, current.parentId), "");
  }

  function saveOrg(type, mode, current) {
    const config = orgConfig[type];
    const keys = ["name", "code", "manager", "phone", "status", "remark"];
    if (type === "warehouse") keys.push("city", "capacity");
    const values = collectForm(keys);
    const errors = {};
    if (!values.name) errors.name = `请输入${config.singular}名称。`;
    if (!values.code) errors.code = "请输入编码。";
    if (!values.manager) errors.manager = "请输入负责人。";
    if (type === "warehouse" && !values.city) errors.city = "请输入仓库所在城市。";
    if (type === "department") {
      values.parentType = qs('[name="parentType"]').value;
      values.parentId = qs('[name="parentId"]').value;
      if (!values.parentId) errors.parentId = "请选择上级层级。";
      values.leader = values.manager;
      delete values.manager;
    } else if (type === "team") {
      values.parentId = qs('[name="parentId"]').value;
      values.leader = values.manager;
      delete values.manager;
      if (!values.parentId) errors.parentId = "小组必须选择所属部门。";
    } else if (type === "hq" || type === "warehouse") {
      values.parentId = "platform";
    } else {
      values.parentId = qs('[name="parentId"]').value;
      if (!values.parentId) errors.parentId = "请选择上级层级。";
    }
    if (showFormErrors(errors)) return false;
    const target = orgRows(type);
    if (mode === "edit") Object.assign(current, values);
    else target.unshift({ id: uid(type), ...values });
    clearSelection();
    showToast(`${config.singular}已保存`, `${values.name} 已按组织层级规则保存。`);
    renderPage();
    return true;
  }

  function orgColumns(type) {
    const common = [
      col("code", "编码"),
      col("name", `${orgConfig[type].singular}名称`),
      col("parent", type === "hq" || type === "warehouse" ? "所属平台" : orgConfig[type].parentLabel || "上级层级", (row) => parentDisplay(row)),
      col("manager", "负责人", (row) => row.manager || row.leader || "-"),
      col("phone", "联系电话"),
      col("status", "状态", (row) => pill(row.status), true),
      col("remark", "说明")
    ];
    if (type === "warehouse") {
      return [
        col("code", "编码"),
        col("name", "仓库名称"),
        col("parent", "所属平台", (row) => parentDisplay(row)),
        col("city", "所在城市"),
        col("capacity", "仓储容量(m³)"),
        col("manager", "负责人"),
        col("phone", "联系电话"),
        col("status", "状态", (row) => pill(row.status), true),
        col("remark", "说明")
      ];
    }
    if (type === "department") {
      return [
        col("code", "编码"),
        col("name", "部门名称"),
        col("parentType", "上级类型", (row) => parentTypeLabels[row.parentType] || "-"),
        col("parent", "上级层级", (row) => orgName(row.parentId)),
        col("leader", "负责人"),
        col("phone", "联系电话"),
        col("status", "状态", (row) => pill(row.status), true),
        col("remark", "说明")
      ];
    }
    return common;
  }

  function orgFilters(type) {
    const config = orgConfig[type];
    const base = [
      inputFilter("code", "编码", "请输入编码"),
      inputFilter("name", `${config.singular}名称`, `请输入${config.singular}名称`)
    ];
    if (type === "department") {
      base.push(
        selectFilter("parentType", "上级类型", [["", "全部类型"], ...Object.entries(parentTypeLabels).map(([value, label]) => [value, label])]),
        selectFilter("parentId", "上级层级", [["", "全部上级"], ...parentFilterOptions(type)])
      );
    } else if (type !== "hq" && type !== "warehouse") {
      base.push(selectFilter("parentId", config.parentLabel || "上级层级", [["", "全部上级"], ...parentFilterOptions(type)]));
    }
    if (type === "warehouse") {
      base.push(
        inputFilter("city", "所在城市", "请输入城市"),
        inputFilter("capacity", "仓储容量(m³)", "请输入容量")
      );
    }
    base.push(
      inputFilter("manager", "负责人", "请输入负责人"),
      inputFilter("phone", "联系电话", "请输入联系电话"),
      statusFilter()
    );
    return base;
  }

  function refLeaf(id, label, category, kind = "general") {
    return {
      id,
      label,
      category,
      kind,
      fields: referenceFieldsByKind(kind, label),
      actions: referenceActionsByKind(kind)
    };
  }

  function flatMenuItems(items) {
    return items.flatMap((item) => item.children ? flatMenuItems(item.children) : [item]);
  }

  function permissionNodeFromNav(item) {
    return {
      id: item.id,
      label: item.label,
      virtual: Boolean(item.children),
      children: item.children ? item.children.map(permissionNodeFromNav) : undefined
    };
  }

  function referenceFieldsByKind(kind, label) {
    const map = {
      customer: ["客户编号", "客户名称", "客户类型", "业务员", "国家/地区", "跟进状态", "状态", "最近跟进"],
      provider: ["服务商编号", "服务商名称", "服务类型", "联系人", "结算方式", "状态", "更新时间"],
      bank: ["账户编号", "开户主体", "开户银行", "银行账号", "币种", "状态", "更新时间"],
      sku: ["SKU编码", "SKU名称", "客户名称", "规格", "重量", "状态", "更新时间"],
      order: ["业务单号", "客户名称", "服务类型", "起运地", "目的地", "处理状态", "状态", "创建时间"],
      waybill: ["运单号", "客户名称", "渠道产品", "目的国家", "计费重", "运输状态", "状态", "创建时间"],
      import: ["导入批次", "文件名称", "导入类型", "总票数", "成功票数", "失败票数", "状态", "导入时间"],
      claim: ["理赔编号", "关联单号", "客户/服务商", "问题类型", "责任方", "处理状态", "状态", "创建时间"],
      query: ["查询编号", "查询名称", "业务类型", "适用范围", "查询结果", "状态", "更新时间"],
      config: ["配置编号", "配置名称", "适用业务", "规则类型", "生效时间", "状态", "更新时间"],
      warehouse: ["仓储单号", "客户名称", "仓库", "操作类型", "件数", "操作状态", "状态", "操作时间"],
      review: ["复核单号", "客户名称", "仓库", "复核类型", "差异数量", "复核状态", "状态", "复核时间"],
      download: ["面单批次", "渠道产品", "客户名称", "单号数量", "下载状态", "状态", "更新时间"],
      print: ["打印批次", "托盘号", "仓库", "件数", "打印状态", "状态", "打印时间"],
      ticket: ["工单编号", "关联单号", "问题类型", "责任方", "处理人", "处理状态", "状态", "创建时间"],
      operation: ["操作单号", "客户名称", "操作节点", "负责人", "截止时间", "处理状态", "状态", "更新时间"],
      customs: ["报关单号", "客户名称", "申报口岸", "资料状态", "申报状态", "状态", "更新时间"],
      finance: ["财务单号", "客户/服务商", "金额", "币种", "账期", "对账状态", "状态", "创建时间"],
      product: ["产品编码", "产品名称", "渠道类型", "目的区域", "重量段", "价格/成本", "状态", "更新时间"],
      master: ["资料编码", "资料名称", "类型", "关联国家/地区", "状态", "更新时间"],
      todo: ["待办编号", "事项名称", "发起人", "发起时间", "审批状态", "状态"],
      crm: ["客户编号", "客户名称", "来源渠道", "跟进人", "跟进阶段", "下次跟进", "状态"]
    };
    return map[kind] || ["编号", `${label}名称`, "业务类型", "负责人", "状态", "更新时间"];
  }

  function referenceActionsByKind(kind) {
    const map = {
      import: ["query", "import", "delete", "export"],
      query: ["query", "export", "download"],
      claim: ["query", "add", "edit", "assign", "close", "export"],
      ticket: ["query", "add", "edit", "assign", "close", "export"],
      warehouse: ["query", "add", "edit", "delete", "review", "print", "export"],
      review: ["query", "review", "export"],
      download: ["query", "download", "export"],
      print: ["query", "print", "export"],
      finance: ["query", "add", "edit", "approve", "reconcile", "export"],
      todo: ["query", "approve", "reject", "export"],
      crm: ["query", "add", "edit", "assign", "export"]
    };
    return map[kind] || ["query", "add", "edit", "delete", "enable", "disable", "export"];
  }

  function referenceColumns(config) {
    if (isWaybillManagePage(config.id)) {
      return [
        col("f0", "运单号"),
        col("f1", "客户名称"),
        col("f2", "渠道产品"),
        col("f3", "目的国家"),
        col("f4", "计费重"),
        col("f5", "运输状态"),
        col("status", "运单状态", (row) => pill(row.status), true),
        col("f7", "创建时间")
      ];
    }
    if (config.id === "myApproval") {
      return [
        col("f0", "审批编号"),
        col("f1", "审批事项"),
        col("f2", "发起人"),
        col("f3", "发起时间"),
        col("f4", "审批状态", (row) => pill(row.f4), true),
        col("f6", "当前节点"),
        col("f7", "抄送人")
      ];
    }
    if (config.id === "myMessage") {
      return [
        col("f0", "消息编号"),
        col("f1", "消息事项"),
        col("f2", "发起人"),
        col("f3", "发起时间"),
        col("f4", "处理状态", (row) => pill(row.f4), true),
        col("f6", "当前节点"),
        col("f7", "抄送人")
      ];
    }
    return config.fields.map((label, index) => {
      if (label === "状态") return col("status", "状态", (row) => pill(row.status), true);
      if (label === "审批状态" || label === "处理状态") {
        const key = referenceFieldKey(index);
        return col(key, label, (row) => pill(row[key]), true);
      }
      return col(referenceFieldKey(index), label);
    });
  }

  function referenceFilters(config) {
    if (isWaybillManagePage(config.id)) {
      return [
        inputFilter("f0", "运单号", "请输入运单号"),
        inputFilter("f1", "客户名称", "请输入客户名称"),
        inputFilter("f2", "渠道产品", "请输入渠道产品"),
        inputFilter("f3", "目的国家", "请输入目的国家"),
        inputFilter("f5", "运输状态", "请输入运输状态")
      ];
    }
    if (config.id === "myApproval") {
      return [
        inputFilter("f0", "审批编号", "请输入审批编号"),
        inputFilter("f1", "审批事项", "请输入审批事项"),
        inputFilter("f2", "发起人", "请输入发起人"),
        selectFilter("f4", "审批状态", [["", "全部审批状态"], ["待审批", "待审批"], ["审批通过", "审批通过"], ["审批不通过", "审批不通过"]])
      ];
    }
    if (config.id === "myMessage") {
      return [
        inputFilter("f0", "消息编号", "请输入消息编号"),
        inputFilter("f1", "消息事项", "请输入消息事项"),
        inputFilter("f2", "发起人", "请输入发起人"),
        selectFilter("f4", "处理状态", [["", "全部处理状态"], ["未处理", "未处理"], ["已处理", "已处理"]])
      ];
    }
    const preferred = [];
    const patterns = /编号|编码|单号|批次|名称|客户|服务商|类型|业务|负责人|业务员|联系人|处理人|跟进人|仓库|币种|国家|目的|区域|口岸|起运地|时间|日期/;
    config.fields.forEach((label, index) => {
      if (label === "状态") {
        preferred.push(statusFilter());
        return;
      }
      if (patterns.test(label)) preferred.push(inputFilter(referenceFieldKey(index), label, `请输入${label}`));
    });
    if (!preferred.some((filter) => filter.name === "status")) preferred.push(statusFilter());
    return preferred.slice(0, 8);
  }

  function statusFilterBar(type) {
    const options = statusBarOptions(type);
    if (!options) return "";
    const active = getFilters(type).status || "";
    return `
      <div class="status-filter-bar" role="tablist" aria-label="状态筛选">
        ${options.map(([value, label]) => `
          <button class="status-filter-chip ${active === value ? "is-active" : ""}" type="button" data-status-filter="${escapeHtml(value)}" role="tab" aria-selected="${active === value}">
            ${escapeHtml(label)}
          </button>
        `).join("")}
      </div>
    `;
  }

  function statusBarOptions(type) {
    if (type === "myApproval") return [["", "全部"], ["待审批", "待审批"], ["已审批", "已审批"], ["抄送", "抄送"], ["已发起", "已发起"]];
    if (type === "myMessage") return [["", "全部"], ["待处理", "待处理"], ["已处理", "已处理"], ["抄送", "抄送"], ["已发起", "已发起"]];
    if (isWaybillManagePage(type)) return [["", "全部"], ...waybillStatusValues().map((status) => [status, status])];
    return null;
  }

  function isWaybillManagePage(type) {
    return type === "waybillManage" || type === "businessWaybillManage";
  }

  function waybillStatusValues() {
    return ["草稿", "已预报", "已到仓", "已打单", "已配舱", "已出仓", "已到港", "派送中", "已签收"];
  }

  function referenceEditableFields(config) {
    return config.fields
      .map((label, index) => ({ label, key: referenceFieldKey(index) }))
      .filter((item) => item.label !== "状态")
      .slice(0, 6);
  }

  function referenceRows(type) {
    if (!state.data.reference[type]) {
      const config = referenceMenuConfigs[type];
      state.data.reference[type] = Array.from({ length: 24 }, (_, index) => referenceRow(config, index));
    }
    return state.data.reference[type];
  }

  function referenceRow(config, index) {
    if (isWaybillManagePage(config.id)) return waybillManageRow(config, index);
    if (config.id === "myApproval") return approvalRow(config, index);
    if (config.id === "myMessage") return messageRow(config, index);
    const row = { id: `${config.id}-${String(index + 1).padStart(3, "0")}`, status: index % 7 === 0 ? "停用" : "启用", owner: sampleOwner(index), remark: "前端原型临时数据" };
    config.fields.forEach((label, fieldIndex) => {
      if (label === "状态") return;
      row[referenceFieldKey(fieldIndex)] = sampleFieldValue(label, config, index);
    });
    return row;
  }

  function waybillManageRow(config, index) {
    const sequence = String(index + 1).padStart(4, "0");
    const day = String(1 + (index % 30)).padStart(2, "0");
    const status = waybillStatusValues()[index % waybillStatusValues().length];
    const transportStatusMap = {
      草稿: "待提交",
      已预报: "预报完成",
      已到仓: "仓库签收",
      已打单: "面单已生成",
      已配舱: "等待出仓",
      已出仓: "干线运输中",
      已到港: "目的港处理",
      派送中: "末端派送",
      已签收: "客户签收"
    };
    return {
      id: `${config.id}-${sequence}`,
      status,
      owner: sampleOwner(index),
      remark: "运单管理静态原型数据",
      f0: `H202604${day}${sequence}`,
      f1: ["星河电子", "远帆贸易", "海桥供应链", "蓝鲸跨境", "北辰科技", "云港商贸"][index % 6],
      f2: ["UPS快递", "Fedex快递", "FBA卡派", "私人卡派", "自提"][index % 5],
      f3: ["美国", "德国", "英国", "加拿大", "澳大利亚", "墨西哥"][index % 6],
      f4: `${(12 + index * 3.5).toFixed(1)}kg`,
      f5: transportStatusMap[status],
      f7: `2026-04-${day} ${String(8 + (index % 10)).padStart(2, "0")}:30`
    };
  }

  function approvalRow(config, index) {
    const no = String(index + 1).padStart(3, "0");
    const approvalStatus = ["待审批", "审批通过", "审批不通过", "待审批"][index % 4];
    const tabStatus = approvalStatus === "待审批" ? ["待审批", "抄送", "已发起"][index % 3] : "已审批";
    const topics = ["价格审批", "账期调整", "异常减免", "客户锁定解除", "运单改派审批", "对账差异确认"];
    return {
      id: `${config.id}-${no}`,
      status: tabStatus,
      owner: sampleOwner(index),
      remark: "审批待办静态原型数据",
      f0: `AP-${no}`,
      f1: topics[index % topics.length],
      f2: sampleOwner(index + 1),
      f3: `2026-04-${String(1 + (index % 30)).padStart(2, "0")} ${String(8 + (index % 10)).padStart(2, "0")}:18`,
      f4: approvalStatus,
      f6: approvalStatus === "待审批" ? "部门主管审批" : "流程结束",
      f7: ["财务对账部", "运营主管", "客户成功部"][index % 3]
    };
  }

  function messageRow(config, index) {
    const no = String(index + 1).padStart(3, "0");
    const tabStatus = ["待处理", "已处理", "抄送", "已发起"][index % 4];
    const processStatus = tabStatus === "已处理" ? "已处理" : "未处理";
    const topics = ["客户30天未下单提醒", "美西渠道价格波动", "海外仓库存预警", "运单轨迹异常", "账期到期提醒", "服务商时效预警"];
    return {
      id: `${config.id}-${no}`,
      status: tabStatus,
      owner: sampleOwner(index),
      remark: "消息待办静态原型数据",
      f0: `MSG-${no}`,
      f1: topics[index % topics.length],
      f2: index % 2 ? "渠道运营部" : "系统",
      f3: `2026-04-${String(1 + (index % 30)).padStart(2, "0")} ${String(8 + (index % 10)).padStart(2, "0")}:30`,
      f4: processStatus,
      f6: processStatus === "未处理" ? "待办处理节点" : "流程结束",
      f7: ["客户成功部", "运营主管", "仓储作业部"][index % 3]
    };
  }

  function referenceFieldKey(index) {
    return `f${index}`;
  }

  function sampleFieldValue(label, config, index) {
    const no = String(index + 1).padStart(3, "0");
    if (/编号|编码|单号|批次/.test(label)) return `${referencePrefix(config)}-${no}`;
    if (/名称|客户/.test(label)) return sampleCustomer(index, config.label);
    if (/服务商/.test(label)) return ["UPS渠道商", "Fedex代理", "美西卡派服务商", "欧洲清关代理"][index % 4];
    if (/类型|业务/.test(label)) return ["快递", "专线", "海运", "海外仓", "卡派"][index % 5];
    if (/业务员|负责人|联系人|处理人|跟进人|发起人|责任方/.test(label)) return sampleOwner(index);
    if (/国家|目的|区域|口岸|起运地/.test(label)) return ["美国", "德国", "英国", "加拿大", "澳大利亚", "深圳", "宁波"][index % 7];
    if (/金额|价格|成本/.test(label)) return `${(820 + index * 37).toLocaleString()} CNY`;
    if (/币种/.test(label)) return ["CNY", "USD", "EUR", "GBP"][index % 4];
    if (/重量|计费重/.test(label)) return `${(12.5 + index * 1.8).toFixed(1)} kg`;
    if (/件数|票数|数量/.test(label)) return String(8 + index * 3);
    if (/时间|日期|跟进|更新时间|创建/.test(label)) return `2026-04-${String(1 + (index % 30)).padStart(2, "0")} ${String(8 + (index % 10)).padStart(2, "0")}:30`;
    if (/状态|阶段|结果/.test(label)) return ["待处理", "处理中", "已完成", "待审核"][index % 4];
    if (/银行/.test(label)) return ["招商银行", "中国银行", "汇丰银行", "花旗银行"][index % 4];
    if (/账号/.test(label)) return `6222 **** **** ${String(1000 + index)}`;
    if (/仓库/.test(label)) return ["宁波保税仓", "深圳前海仓", "洛杉矶海外仓", "法兰克福海外仓"][index % 4];
    return `${config.label}-${no}`;
  }

  function referencePrefix(config) {
    return config.label.replace(/[^\u4e00-\u9fa5A-Za-z0-9]/g, "").slice(0, 4).toUpperCase() || "REF";
  }

  function sampleCustomer(index, fallback) {
    return ["星河电子", "远帆贸易", "海桥供应链", "蓝鲸跨境", "北辰科技", fallback][index % 6];
  }

  function sampleOwner(index) {
    return ["林岚", "周宁", "陈越", "许然", "吴航", "宋乔"][index % 6];
  }

  function orgTreePanel(type) {
    const tree = buildOrgTree(type);
    const selected = selectedOrgTreeNode(type, tree);
    const selectedText = selected ? `${selected.label} / ${selected.meta}` : "未选择组织节点";
    return `
      <aside class="admin-card org-tree-card">
        <div class="org-tree-head">
          <strong>组织架构</strong>
          <span>${orgTreeHint(type)}</span>
        </div>
        <div class="org-tree-current">
          <span>当前选择</span>
          <b>${escapeHtml(selectedText)}</b>
        </div>
        <div class="org-tree-list">
          ${orgTreeNodesHtml(type, [tree])}
        </div>
      </aside>
    `;
  }

  function orgTreeHint(type) {
    const hints = {
      employees: "选择部门或小组后，新增员工会自动带入组织归属。",
      region: "选择总部后，新增大区会自动带入所属总部。",
      branch: "选择大区后，新增分公司会自动带入所属大区。",
      warehouse: "仓库默认挂在平台层级，可查看平台下仓库结构。",
      department: "选择总部、大区、分公司或仓库后，新增部门会自动带入上级层级。",
      team: "选择部门后，新增小组会自动带入所属部门。"
    };
    return hints[type] || "选择组织节点后新增时自动带入。";
  }

  function orgTreeNodesHtml(type, nodes, level = 1) {
    return nodes.map((node) => {
      const selectable = isOrgTreeSelectable(type, node);
      const active = selectable && state.orgTreeSelection[type] === node.id;
      const hasChildren = Boolean(node.children?.length);
      const expanded = hasChildren && state.orgTreeExpanded.has(node.id);
      return `
        <div class="org-tree-item level-${level}">
          <div class="org-tree-row" data-org-tree-row="${escapeHtml(node.id)}">
            <button class="org-tree-toggle" type="button" ${hasChildren ? `data-org-tree-toggle="${escapeHtml(node.id)}" aria-label="${expanded ? "收起" : "展开"}${escapeHtml(node.label)}"` : "disabled"}>
              ${hasChildren ? (expanded ? "-" : "+") : ""}
            </button>
            <button class="org-tree-button ${active ? "is-active" : ""}" type="button" ${selectable ? `data-org-tree-select="${escapeHtml(node.id)}" data-org-tree-label="${escapeHtml(node.label)}"` : "disabled"}>
              <span>${escapeHtml(node.label)}</span>
              <em>${escapeHtml(node.meta)}</em>
            </button>
          </div>
          ${hasChildren && expanded ? `<div class="org-tree-children">${orgTreeNodesHtml(type, node.children, level + 1)}</div>` : ""}
        </div>
      `;
    }).join("");
  }

  function captureOrgTreeAnchor(type, button) {
    const card = button.closest(".org-tree-card");
    const row = button.closest("[data-org-tree-row]");
    if (!card || !row) return;
    state.pendingOrgTreeAnchor = {
      type,
      id: row.dataset.orgTreeRow,
      top: row.getBoundingClientRect().top,
      scrollTop: card.scrollTop
    };
  }

  function restoreOrgTreeAnchor(type) {
    const anchor = state.pendingOrgTreeAnchor;
    if (!anchor || anchor.type !== type) return;
    const card = qs(".org-tree-card", root);
    const row = qsa("[data-org-tree-row]", root).find((item) => item.dataset.orgTreeRow === anchor.id);
    if (card && row) {
      card.scrollTop = anchor.scrollTop;
      card.scrollTop += row.getBoundingClientRect().top - anchor.top;
    }
    state.pendingOrgTreeAnchor = null;
  }

  function selectedOrgTreeNode(type, tree = buildOrgTree(type)) {
    if (!orgTreePageIds.has(type)) return null;
    const selectableNodes = flattenOrgTree(tree).filter((node) => isOrgTreeSelectable(type, node));
    if (!selectableNodes.length) return null;
    const previousSelection = state.orgTreeSelection[type];
    let selected = selectableNodes.find((node) => node.id === state.orgTreeSelection[type]);
    if (!selected) selected = selectableNodes[0];
    state.orgTreeSelection[type] = selected.id;
    if (previousSelection !== selected.id) expandOrgTreePath(tree, selected.id);
    return selected;
  }

  function flattenOrgTree(node) {
    return [node, ...(node.children || []).flatMap((child) => flattenOrgTree(child))];
  }

  function expandOrgTreePath(node, targetId, path = []) {
    if (node.id === targetId) {
      path.forEach((id) => state.orgTreeExpanded.add(id));
      return true;
    }
    return (node.children || []).some((child) => expandOrgTreePath(child, targetId, [...path, node.id]));
  }

  function isOrgTreeSelectable(type, node) {
    return Boolean(orgTreeSelectableKinds[type]?.has(node.kind));
  }

  function buildOrgTree(type) {
    const root = orgTreeNode("platform", platform.id, platform.name, "平台层级");
    if (type === "region") {
      root.children = state.data.org.headquarters.map((item) => orgTreeNode("headquarters", item.id, item.name, `总部 / ${item.status}`));
      return root;
    }
    if (type === "branch") {
      root.children = state.data.org.headquarters.map((hq) => orgTreeNode("headquarters", hq.id, hq.name, `总部 / ${hq.status}`,
        state.data.org.regions
          .filter((region) => region.parentId === hq.id)
          .map((region) => orgTreeNode("regions", region.id, region.name, `大区 / ${region.status}`))
      ));
      return root;
    }
    if (type === "warehouse") {
      root.children = state.data.org.warehouses.map((item) => orgTreeNode("warehouses", item.id, item.name, `仓库 / ${item.status}`));
      return root;
    }
    const includeTeams = type === "employees" || type === "team";
    root.children = [
      ...state.data.org.headquarters.map((hq) => fullHeadquarterNode(hq, includeTeams)),
      ...state.data.org.warehouses.map((warehouse) => fullWarehouseNode(warehouse, includeTeams))
    ];
    return root;
  }

  function fullHeadquarterNode(hq, includeTeams) {
    const regions = state.data.org.regions
      .filter((region) => region.parentId === hq.id)
      .map((region) => fullRegionNode(region, includeTeams));
    return orgTreeNode("headquarters", hq.id, hq.name, `总部 / ${hq.status}`, [
      ...regions,
      ...departmentTreeNodes(hq.id, includeTeams)
    ]);
  }

  function fullRegionNode(region, includeTeams) {
    const branches = state.data.org.branches
      .filter((branch) => branch.parentId === region.id)
      .map((branch) => fullBranchNode(branch, includeTeams));
    return orgTreeNode("regions", region.id, region.name, `大区 / ${region.status}`, [
      ...branches,
      ...departmentTreeNodes(region.id, includeTeams)
    ]);
  }

  function fullBranchNode(branch, includeTeams) {
    return orgTreeNode("branches", branch.id, branch.name, `分公司 / ${branch.status}`, departmentTreeNodes(branch.id, includeTeams));
  }

  function fullWarehouseNode(warehouse, includeTeams) {
    return orgTreeNode("warehouses", warehouse.id, warehouse.name, `仓库 / ${warehouse.status}`, departmentTreeNodes(warehouse.id, includeTeams));
  }

  function departmentTreeNodes(parentId, includeTeams) {
    return state.data.org.departments
      .filter((dept) => dept.parentId === parentId)
      .map((dept) => orgTreeNode("departments", dept.id, dept.name, `部门 / ${dept.status}`, includeTeams ? teamTreeNodes(dept.id) : []));
  }

  function teamTreeNodes(parentId) {
    return state.data.org.teams
      .filter((team) => team.parentId === parentId)
      .map((team) => orgTreeNode("teams", team.id, team.name, `小组 / ${team.status}`));
  }

  function orgTreeNode(kind, id, label, meta, children = []) {
    return { kind, id, label, meta, children };
  }

  function orgDefaultsFromTree(type) {
    const selected = selectedOrgTreeNode(type);
    if (type === "region" && selected?.kind === "headquarters") return { parentId: selected.id };
    if (type === "branch" && selected?.kind === "regions") return { parentId: selected.id };
    if (type === "warehouse") return { parentId: "platform" };
    if (type === "department" && ["headquarters", "regions", "branches", "warehouses"].includes(selected?.kind)) {
      return { parentType: selected.kind, parentId: selected.id };
    }
    if (type === "team" && selected?.kind === "departments") return { parentId: selected.id };
    return {};
  }

  function employeeDefaultsFromTree() {
    const selected = selectedOrgTreeNode("employees");
    return ["departments", "teams"].includes(selected?.kind) ? { orgId: selected.id } : {};
  }

  function parentFilterOptions(type) {
    if (type === "hq" || type === "warehouse") return [[platform.id, platform.name]];
    if (type === "department") {
      return ["headquarters", "regions", "branches", "warehouses"].flatMap((collection) => getCollection(collection).map((item) => [item.id, `${parentTypeLabels[collection]} / ${item.name}`]));
    }
    return getCollection(orgConfig[type].parentKind).map((item) => [item.id, item.name]);
  }

  function openModal(title, bodyHtml, onSave) {
    const layer = qs("#adminModalLayer");
    qs("#adminModalTitle").textContent = title;
    qs("#adminModalBody").innerHTML = bodyHtml;
    qs("#adminModalFoot").innerHTML = `
      <button class="admin-btn" type="button" data-modal-close>取消</button>
      <button class="admin-btn primary" type="button" data-modal-save>保存</button>
    `;
    layer.classList.add("is-open");
    layer.setAttribute("aria-hidden", "false");
    qs("[data-modal-save]").addEventListener("click", () => {
      if (onSave()) closeModal();
    });
    qsa("[data-modal-close]").forEach((button) => button.addEventListener("click", closeModal));
  }

  function closeModal() {
    const layer = qs("#adminModalLayer");
    layer.classList.remove("is-open");
    layer.setAttribute("aria-hidden", "true");
  }

  function field(label, name, value = "", placeholder = "") {
    return `
      <div class="form-field">
        <label>${label}</label>
        <input class="admin-input" name="${name}" value="${escapeHtml(value || "")}" placeholder="${placeholder}">
        <div class="form-error" data-form-error="${name}"></div>
      </div>
    `;
  }

  function passwordField(label, name, placeholder = "") {
    return `
      <div class="form-field">
        <label>${label}</label>
        <input class="admin-input" type="password" name="${name}" placeholder="${escapeHtml(placeholder)}" autocomplete="new-password">
        <div class="form-error" data-form-error="${name}"></div>
      </div>
    `;
  }

  function selectField(label, name, options, hint = "") {
    return `
      <div class="form-field">
        <label>${label}</label>
        <select class="admin-select" name="${name}">${options}</select>
        <div class="form-error" data-form-error="${name}">${hint ? `<span>${hint}</span>` : ""}</div>
      </div>
    `;
  }

  function optionList(items, selected) {
    return items.map((item) => {
      const value = typeof item === "string" ? item : item.value;
      const label = typeof item === "string" ? item : item.label;
      return `<option value="${escapeHtml(value)}" ${value === selected ? "selected" : ""}>${escapeHtml(label)}</option>`;
    }).join("");
  }

  function parentOptions(collection, selected) {
    return getCollection(collection).map((item) => `<option value="${item.id}" ${item.id === selected ? "selected" : ""}>${escapeHtml(item.name)}</option>`).join("");
  }

  function checkCard(name, value, label, checked) {
    return `<label class="check-card"><input type="checkbox" name="${name}" value="${escapeHtml(value)}" ${checked ? "checked" : ""}>${escapeHtml(label)}</label>`;
  }

  function collectForm(keys) {
    return keys.reduce((acc, key) => {
      const el = qs(`[name="${key}"]`);
      acc[key] = el ? el.value.trim() : "";
      return acc;
    }, {});
  }

  function checkedValues(name) {
    return qsa(`[name="${name}"]:checked`).map((input) => input.value);
  }

  function showFormErrors(errors) {
    qsa("[data-form-error]").forEach((el) => { el.textContent = ""; });
    Object.entries(errors).forEach(([key, message]) => {
      const target = qs(`[data-form-error="${key}"]`);
      if (target) target.textContent = message;
    });
    return Object.keys(errors).length > 0;
  }

  function findRecord(type, id) {
    if (type === "employees") return state.data.employees.find((item) => item.id === id);
    if (type === "roles") return state.data.roles.find((item) => item.id === id);
    if (referenceMenuConfigs[type]) return referenceRows(type).find((item) => item.id === id);
    return orgRows(type).find((item) => item.id === id);
  }

  function removeRecord(type, id) {
    if (type === "employees") state.data.employees = state.data.employees.filter((item) => item.id !== id);
    else if (type === "roles") state.data.roles = state.data.roles.filter((item) => item.id !== id);
    else if (referenceMenuConfigs[type]) state.data.reference[type] = referenceRows(type).filter((item) => item.id !== id);
    else {
      const collection = orgConfig[type].collection;
      state.data.org[collection] = state.data.org[collection].filter((item) => item.id !== id);
    }
  }

  function deleteBlockReason(type, id) {
    if (type === "roles" && state.data.employees.some((emp) => emp.roleIds.includes(id))) return "该角色已关联员工，请先调整员工角色。";
    if (["hq", "region", "branch", "warehouse", "department", "team"].includes(type)) {
      if (state.data.employees.some((emp) => emp.orgId === id)) return "该组织已关联员工，请先调整员工归属。";
      if (orgChildren(id).length) return "该组织存在下级层级，请先处理下级组织。";
    }
    return "";
  }

  function orgChildren(parentId) {
    return Object.values(state.data.org).flat().filter((item) => item.parentId === parentId);
  }

  function getCollection(collection) {
    if (collection === "platform") return [platform];
    return state.data.org[collection] || [];
  }

  function orgRows(type) {
    return state.data.org[orgConfig[type].collection];
  }

  function selectableEmployeeOrgs() {
    return [
      ...state.data.org.departments.map((item) => ({ ...item, type: "部门" })),
      ...state.data.org.teams.map((item) => ({ ...item, type: "小组" }))
    ].filter((item) => item.status === "启用");
  }

  function orgName(id) {
    if (id === "platform") return platform.name;
    const found = Object.values(state.data.org).flat().find((item) => item.id === id);
    return found ? found.name : "-";
  }

  function roleNames(ids = []) {
    return ids.map((id) => state.data.roles.find((role) => role.id === id)?.name).filter(Boolean).join("、") || "-";
  }

  function parentDisplay(row) {
    if (row.parentId === "platform") return `${platform.name}（内置）`;
    const typeLabel = row.parentType ? `${parentTypeLabels[row.parentType]} / ` : "";
    return `${typeLabel}${orgName(row.parentId)}`;
  }

  function pill(status) {
    const map = {
      停用: "off",
      待审批: "pending",
      待处理: "pending",
      未处理: "pending",
      审批通过: "done",
      审批不通过: "off",
      已审批: "done",
      已处理: "done",
      抄送: "copy",
      已发起: "started",
      草稿: "pending",
      已预报: "started",
      已到仓: "copy",
      已打单: "started",
      已配舱: "started",
      已出仓: "copy",
      已到港: "copy",
      派送中: "pending",
      已签收: "done"
    };
    return `<span class="status-pill ${map[status] || ""}">${status}</span>`;
  }

  function orgDescription(type) {
    const descriptions = {
      hq: "总部创建时默认关联到平台层级，总部下可继续创建大区或部门。",
      region: "大区必须挂在总部下，大区下可继续创建分公司或部门。",
      branch: "分公司必须挂在大区下，分公司下可继续创建部门。",
      warehouse: "仓库创建时默认关联到平台层级，仓库下可继续创建部门。",
      department: "部门可挂在总部、大区、分公司或仓库下，部门下可继续创建小组。",
      team: "小组必须挂在部门下，是员工归属的最细管理层级之一。"
    };
    return descriptions[type];
  }

  function permissionStats(role) {
    const permissions = role.permissions || {};
    return Object.values(permissions).reduce((acc, item) => {
      if (item.enabled) acc.menuCount += 1;
      acc.buttonCount += item.buttons?.length || 0;
      acc.fieldCount += item.fields?.length || 0;
      return acc;
    }, { menuCount: 0, buttonCount: 0, fieldCount: 0 });
  }

  function clonePermissions(source) {
    const permissions = source ? JSON.parse(JSON.stringify(source)) : {};
    permissionMenus.forEach((menu) => {
      if (!permissions[menu.id]) permissions[menu.id] = { enabled: false, buttons: [], fields: [] };
      permissions[menu.id].buttons = permissions[menu.id].buttons || [];
      permissions[menu.id].fields = permissions[menu.id].fields || [];
    });
    return permissions;
  }

  function expandSampleData() {
    if (expandSampleData.done) return;
    expandSampleData.done = true;

    const hqNames = ["华北运营总部", "西南运营总部", "华中运营总部", "东北运营总部", "西北运营总部", "华东二部", "华南二部", "海外事业总部", "跨境电商总部", "大客户总部", "关务总部", "干线总部", "海外仓总部", "渠道总部"];
    hqNames.forEach((name, index) => state.data.org.headquarters.push({
      id: `hq-${index + 3}`,
      code: `HQ-${String(index + 3).padStart(3, "0")}`,
      name,
      manager: ["秦越", "陆遥", "姜晨", "韩霄", "梁知"][index % 5],
      phone: `13800011${String(index).padStart(3, "0")}`,
      parentId: "platform",
      status: index % 7 === 0 ? "停用" : "启用",
      remark: "负责区域资源统筹与跨境物流运营管理"
    }));

    const regionNames = ["京津冀大区", "成渝大区", "华中大区", "东北大区", "西北大区", "苏皖大区", "福建大区", "日韩大区", "欧美大区", "拉美大区", "中东大区", "澳新大区", "跨境平台招商大区", "航线采购大区"];
    regionNames.forEach((name, index) => state.data.org.regions.push({
      id: `region-${index + 3}`,
      code: `RG-${String(index + 3).padStart(3, "0")}`,
      name,
      manager: ["顾舟", "马青", "魏宁", "唐棠", "邵远"][index % 5],
      phone: `13800022${String(index).padStart(3, "0")}`,
      parentId: state.data.org.headquarters[index % state.data.org.headquarters.length].id,
      status: index % 6 === 0 ? "停用" : "启用",
      remark: "负责大区销售、操作与客户履约协同"
    }));

    const branchNames = ["北京分公司", "天津分公司", "成都分公司", "重庆分公司", "武汉分公司", "郑州分公司", "沈阳分公司", "大连分公司", "西安分公司", "厦门分公司", "福州分公司", "青岛分公司", "杭州分公司", "南京分公司", "广州分公司", "东莞分公司"];
    branchNames.forEach((name, index) => state.data.org.branches.push({
      id: `branch-${index + 3}`,
      code: `BR-${String(index + 3).padStart(3, "0")}`,
      name,
      manager: ["罗一", "许景", "钟灵", "袁野", "丁宁"][index % 5],
      phone: `13800033${String(index).padStart(3, "0")}`,
      parentId: state.data.org.regions[index % state.data.org.regions.length].id,
      status: index % 8 === 0 ? "停用" : "启用",
      remark: "承接本地客户开发、订单运营与异常处理"
    }));

    const warehouseNames = ["上海临港仓", "深圳前海仓", "广州南沙仓", "义乌集货仓", "青岛港前仓", "天津港前仓", "成都保税仓", "重庆保税仓", "大阪海外仓", "法兰克福海外仓", "伦敦海外仓", "纽约海外仓", "达拉斯海外仓", "迪拜海外仓", "悉尼海外仓", "多伦多海外仓"];
    warehouseNames.forEach((name, index) => state.data.org.warehouses.push({
      id: `wh-${index + 3}`,
      code: `WH-${String(index + 3).padStart(3, "0")}`,
      name,
      manager: ["潘越", "林深", "孟秋", "齐乐", "方也"][index % 5],
      phone: `13800044${String(index).padStart(3, "0")}`,
      city: name.replace(/(海外仓|港前仓|保税仓|集货仓|临港仓|前海仓|南沙仓)/g, ""),
      capacity: String(5200 + index * 680),
      parentId: "platform",
      status: index % 7 === 0 ? "停用" : "启用",
      remark: "支持入库、分拣、贴标、出库与尾程分拨"
    }));

    const deptNames = ["客户成功部", "海运操作部", "陆运调度部", "财务对账部", "销售支持部", "海外客服部", "订单履约部", "异常处理部", "报价管理部", "系统运营部", "渠道管理部", "仓储质控部", "数据分析部", "合规稽核部", "大客户服务部", "结算管理部"];
    const deptParents = [
      ...state.data.org.headquarters.map((item) => ["headquarters", item.id]),
      ...state.data.org.regions.map((item) => ["regions", item.id]),
      ...state.data.org.branches.map((item) => ["branches", item.id]),
      ...state.data.org.warehouses.map((item) => ["warehouses", item.id])
    ];
    deptNames.forEach((name, index) => {
      const [parentType, parentId] = deptParents[index % deptParents.length];
      state.data.org.departments.push({
        id: `dept-${index + 4}`,
        code: `DP-${String(index + 4).padStart(3, "0")}`,
        name,
        leader: ["叶舟", "邹云", "乔安", "苏明", "白川"][index % 5],
        phone: `13800055${String(index).padStart(3, "0")}`,
        parentType,
        parentId,
        status: index % 9 === 0 ? "停用" : "启用",
        remark: "负责对应业务模块的日常协同与流程执行"
      });
    });

    const teamNames = ["美线操作小组", "欧线操作小组", "东南亚客服小组", "FBA卡派小组", "UPS快递小组", "Fedex快递小组", "账单核对小组", "客户跟进小组", "锁客维护小组", "尾程异常小组", "仓内质检小组", "海外仓补货小组", "资料审核小组", "价格维护小组", "回款跟进小组", "报表支持小组", "大客户跟进小组", "自提协调小组"];
    teamNames.forEach((name, index) => state.data.org.teams.push({
      id: `team-${index + 3}`,
      code: `TM-${String(index + 3).padStart(3, "0")}`,
      name,
      leader: ["安予", "江澈", "梅清", "祁然", "沈路"][index % 5],
      phone: `13800066${String(index).padStart(3, "0")}`,
      parentId: state.data.org.departments[index % state.data.org.departments.length].id,
      status: index % 8 === 0 ? "停用" : "启用",
      remark: "小组负责具体客户、线路或作业任务闭环"
    }));

    const roleNames = ["客服主管", "销售经理", "关务经理", "财务对账", "仓储主管", "海外仓专员", "航线采购", "异常处理", "数据分析", "渠道运营", "大客户经理", "订单操作", "价格维护", "结算专员", "只读审计"];
    roleNames.forEach((name, index) => state.data.roles.push({
      id: `role-${index + 4}`,
      code: `ROLE_${String(index + 4).padStart(3, "0")}`,
      name,
      scope: ["全部数据", "所属组织及下级", "本人数据"][index % 3],
      status: index % 6 === 0 ? "停用" : "启用",
      permissions: index % 4 === 0 ? limitedPermissions("home", "employees", "roles") : limitedPermissions("home", "employees", "hq", "region", "branch", "warehouse", "department", "team")
    }));

    const employeeNames = ["顾南", "林夏", "周衡", "陈安", "黄予", "罗宁", "钟白", "唐悦", "韩川", "梁星", "秦朗", "陆晨", "姜宁", "魏舟", "马越", "邵晴", "叶知", "苏远", "白鹿", "乔木", "方泽", "齐月", "孟然", "潘森", "许诺"];
    const employeeOrgs = selectableEmployeeOrgs();
    employeeNames.forEach((name, index) => state.data.employees.push({
      id: `emp-${String(index + 4).padStart(3, "0")}`,
      name,
      account: `hyd${String(index + 4).padStart(3, "0")}`,
      mobile: `13810002${String(index).padStart(3, "0")}`,
      email: `user${index + 4}@hyd-logistics.com`,
      orgId: employeeOrgs[index % employeeOrgs.length].id,
      roleIds: [state.data.roles[index % state.data.roles.length].id],
      status: index % 7 === 0 ? "停用" : "启用",
      lastLogin: `2026-04-${String(1 + (index % 30)).padStart(2, "0")} ${String(8 + (index % 10)).padStart(2, "0")}:30`
    }));
  }

  function showToast(title, text) {
    const toast = qs("#adminToast");
    if (!toast) return;
    toast.querySelector("strong").textContent = title;
    toast.querySelector("span").textContent = text;
    toast.classList.add("is-visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  window.AdminApp = { enter, leave };
  init();
})();
