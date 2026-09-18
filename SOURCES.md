# 内容核对记录

核对日期：2026-09-12。视频目录与来源清单是本次人工检索与脚本核对的快照，不是实时抓取或自动更新服务。

## 视频（`src/content/videos.js`）

- 视频入口全部是 YouTube 单视频直链，共 111 条，覆盖 11 个部位、24 个频道。`src/data.js` 按视频 ID 生成播放地址与缩略图，并按上传日期由新到旧排序。
- 每条记录的 `original`（原始标题）、`channel`、`channelId`、`publishedAt`（上传日期）、`lengthSeconds`、`viewCount` 均在 2026-09-12 直接读取自 YouTube 观看页的元数据（`playerMicroformatRenderer` / `videoDetails`），并确认 `playabilityStatus` 为 OK；不采用机构网页的更新日期，也不采用核对日期。`title` 为编者撰写的中文标题，`tags`、`kind`（拉伸 / 跟练 / 活动度 / 拉伸与力量 / 康复讲解 / 神经滑动）为编者根据标题与说明归类。
- 发布者筛选标准：物理治疗师（PT / DPT）、医师（MD）、医院或骨科机构（HSS、Cleveland Clinic、Dartmouth Health、Michigan Orthopedic Center 等）、公共卫生机构（NHS、NHS inform、East Cheshire NHS Trust）。`publisherType` 标注类型，`credentials` 描述发布者身份；两者都表示身份而非临床审核，也不表示视频适合每一个人。
- 优先收录 2024 年以后上传的内容（2026 年 25 条、2025 年 34 条、2024 年 38 条），保留少量较早的专业示范补充覆盖。综合视频标注为"跟练""活动度""康复讲解"等，避免把所有内容描述为纯拉伸。
- 本次移除了旧目录中 11 条观看数不足 100 次、时长多在 1 分钟以内的小型诊所片段（ID：xYBX56SOIAA、W6MnnokO-8A、1F9pNkgmItU、bGOAwKz2eig、XhwEAt3KHlg、Ry2fqz7xTW4、ey5WESF0ONc、eEdLEtZRCrY、Di0dgF1DqJ0、jqr4BlJzs8E、Y6_NEfbR6Zs），如需恢复可用下方脚本重新核验后加回。

## 康复建议来源（`src/content/sources.js`）

- 剂量默认值：ACSM 立场声明（Garber 等，2011，PubMed 21694556）与 ACSM FITT 建议表——静态拉伸保持 10–30 秒、每个动作重复 2–4 次、累计 60 秒、每周 ≥2–3 天；老年人可延长至 30–60 秒。
- 拉伸与运动表现：Behm 等 2016 系统综述（单块肌肉静态拉伸 ≥60 秒时表现下降约 4.6%，<60 秒约 1.1%；动态拉伸 +1.3%）。拉伸与肌肉酸痛：Herbert 等 2011 Cochrane 综述。拉伸时长与活动度：Thomas 等 2018（每肌群每周 ≥5 分钟）。
- 部位方案与就医建议：NHS（腰背痛、颈痛、坐骨神经痛、腕管综合征、柔韧性练习）、NHS inform 苏格兰（颈、背、肩、髋、膝、足、腕手、肘的练习页，2026-07 更新；建议拉伸保持 20–30 秒，6 周无改善应咨询专业人员）、AAOS OrthoInfo（肩袖、脊柱、髋、膝、足踝康复方案：热身 5–10 分钟，拉伸保持 30 秒、放松 30 秒，方案 4–6 周后每周 2–3 天维持；上髁炎练习方案：保持 15 秒 × 5 次、每天 4 组；足底筋膜炎：10 秒 × 20 次）、NICE NG59（2026-07-29 更新）、Mayo Clinic、Harvard Health、HSS、Cleveland Clinic、WHO 2020 指南。
- 所有链接在 2026-09-12 用 curl 或浏览器核对可访问；迁移过的页面（NHS inform 练习页、OrthoInfo 域名、Harvard、HSS、Cleveland Clinic、ACSM）已更新为当前地址。Mayo Clinic 与 PubMed 对脚本请求返回 403/203，但在浏览器中可正常打开。
- 动作卡片上的"参考"链接指向该动作所属的方案或练习页；同一动作在不同机构页面中的名称与剂量略有差异时，以卡片标注的剂量为准，并在"依据与就医"标签列出全部来源。

## 解剖图谱

原创 SVG 是按部位组织的教育示意，并非完整医学解剖模型。浅层与深层表示肌肉之间的覆盖关系，不等同于解剖间室分类，例如比目鱼肌位于腓肠肌深面，但仍属于后侧浅室。

名称与覆盖关系核对资料：

- [NCBI：小腿解剖](https://www.ncbi.nlm.nih.gov/books/NBK459362/)
- [NCBI：肱桡肌](https://www.ncbi.nlm.nih.gov/books/NBK526110/)
- [NCBI：上臂与前臂分区](https://www.ncbi.nlm.nih.gov/books/NBK507841/)
- [NCBI：肩袖与小圆肌](https://www.ncbi.nlm.nih.gov/books/NBK513324/)
- [NCBI：大腿后侧肌群](https://www.ncbi.nlm.nih.gov/books/NBK554598/)
- [NCBI：肩胛提肌](https://www.ncbi.nlm.nih.gov/books/NBK553120/)

## 如何重新核对

`scripts/yt_meta.mjs ID1 ID2 …` 通过 curl（走系统代理）抓取 YouTube 观看页并输出 `title`、`channel`、`publishDate`、`lengthSeconds`、`viewCount`、`status`；`scripts/yt_search.mjs "关键词" 15` 输出搜索结果供筛选候选。来源链接用 `curl -sIL` 检查最终状态码。页面内容属于健康教育信息，不构成诊断或个体化治疗方案。
