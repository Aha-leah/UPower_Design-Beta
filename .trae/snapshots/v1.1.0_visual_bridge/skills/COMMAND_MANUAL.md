# 🕹️ AI Team Command Manual (口令手册)

此文档是与 AI 智能体团队协作的**标准指令集**。
只需使用以下自然语言指令，即可驱动整个项目从 0 到 1 的自动化构建。

## 🚀 核心指令 (Core Commands)

最常用的指令，由 **Project Manager** (项目经理) 统一调度。

| 场景 | 口令 (中文) | 口令 (English) | 预期行为 |
| :--- | :--- | :--- | :--- |
| **启动新项目** | "启动新项目 [项目名]" | "Start project [Name]" | 1. 创建项目目录 `Source/[Name]`<br>2. 初始化 `project_state.json`<br>3. 复制基础模版 |
| **推进进度** | "项目经理，请推进" | "Project Manager, proceed" | 1. 读取当前状态<br>2. 自动识别下一步阻赛点<br>3. 呼叫对应专才解决问题 |
| **查询状态** | "汇报当前项目状态" | "Report status" | 列出当前 Manifest 状态，显示哪些资产已完成，哪些待办。 |
| **开启自动驾驶** | "启动守护进程" | "Start Daemon" | 在后台运行文件监听服务，实现“文件变动即触发下一步”的实时响应。 |

---

## 👥 专才指令 (Direct Agent Commands)

如果你想跳过项目经理，直接指挥特定角色干活 (Human-in-the-loop)。

### 1. 产品与定义 (Product & Definition)
*   **呼叫角色**: `product-designer` (Alice)
*   **口令**:
    *   "帮我根据输入生成 PRD" (Generate PRD)
    *   "基于 PRD 提炼品牌 DNA" (Synthesize Brand DNA)

### 2. 设计与资产 (Design & Assets)
*   **呼叫角色**: `ux-architect` (The Architect)
    *   "生成页面骨架 JSON" (Generate Skeleton)
*   **呼叫角色**: `visual-designer` (Bob)
    *   "生成视觉风格和动效指南" (Generate Style & Motion)
*   **呼叫角色**: `system-architect` (The Engineer)
    *   "生成设计规范" (Generate Specs)
*   **呼叫角色**: `growth-ops-architect` (Tina)
    *   "生成真实填充内容" (Generate Payload)

### 3. 构建与验收 (Build & Audit)
*   **呼叫角色**: `frontend-engineer` (Ken)
    *   "组装 System Prompt" (Assemble Prompt)
    *   "开始编写代码" (Start Coding)
    *   "启动预览服务器" (Start Server)
*   **呼叫角色**: `project-auditor` (The Critic)
    *   "验收当前产出" (Audit Project)

---

## 🛠️ 常见问题排查 (Troubleshooting)

*   **Q: AI 好像卡住了？**
    *   **A**: 说 "Project Manager, check state" (项目经理，检查状态)。它会重新读取 Manifest 并尝试恢复。
*   **Q: 想修改规则？**
    *   **A**: 修改 `.trae/rules` 下的文件，然后说 "Reload context" (重载上下文)。
*   **Q: 找不到生成的文件？**
    *   **A**: 所有产出都在 `Source/[项目名]/` 目录下。

---

## 💡 最佳实践 (Best Practices)

1.  **少管闲事**: 尽量只和 `project-manager` 对话，让它去指挥其他人。
2.  **提供弹药**: 在启动项目后，确保 `Source/[项目名]/input/for_prd/` 里有足够的素材，否则 AI 没法干活。
3.  **看红绿灯**: 记得查看 `.trae/rules`，那是团队的“宪法”。
