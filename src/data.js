import { videoCatalog } from './content/videos.js';

export const verifiedOn = '2026-09-12';

export const regions = [
  { id: 'neck', name: '肩颈部', en: 'NECK & SHOULDERS', latin: 'Trapezius · Levator scapulae · SCM', short: '肩颈', muscles: ['斜方肌上束', '胸锁乳突肌', '肩胛提肌'], nerves: '副神经（XI）· 颈丛 · 肩胛背神经（示意）', description: '低头工作、长时间久坐，容易让肩颈持续紧绷。用温和的活动，重新找回轻松感。', causes: ['伏案久坐', '长时间低头', '压力紧张'], tip: '肩膀放松，呼吸也慢一点。', query: 'neck stretches physical therapist', minutes: 5 },
  { id: 'shoulder', name: '肩部', en: 'SHOULDERS', latin: 'Deltoid · Rotator cuff', short: '肩部', muscles: ['三角肌', '冈上肌', '冈下肌', '小圆肌', '肩胛下肌'], nerves: '腋神经 · 肩胛上神经 · 肩胛下神经（示意）', description: '肩部连接手臂与躯干。先了解自己的活动范围，再选择适合的轻柔伸展。', causes: ['长时间用鼠标', '上肢训练', '重复抬臂'], tip: '让肩部活动自然，不用追求幅度。', query: 'shoulder stretches physical therapy', minutes: 5 },
  { id: 'chest', name: '胸部', en: 'CHEST', latin: 'Pectoralis major · Pectoralis minor', short: '胸部', muscles: ['胸大肌', '胸小肌', '前锯肌'], nerves: '胸内侧神经 · 胸外侧神经 · 胸长神经（示意）', description: '胸部肌群参与推举与手臂活动。适当舒展，为上半身留出更多活动空间。', causes: ['含胸姿势', '推举训练', '久坐办公'], tip: '轻轻打开胸口，避免腰部过度后仰。', query: 'pec stretch doorway physical therapy', minutes: 5 },
  { id: 'upperBack', name: '上背部', en: 'UPPER BACK', latin: 'Trapezius · Rhomboids · Latissimus dorsi', short: '上背', muscles: ['斜方肌中下束', '菱形肌', '背阔肌', '大圆肌'], nerves: '肩胛背神经 · 胸背神经 · 副神经（示意）', description: '上背肌群帮助稳定肩胛。用缓慢的动作，感受肩胛周围的张力变化。', causes: ['圆肩含胸', '久坐', '背部训练'], tip: '让肩胛自然移动，保持轻松呼吸。', query: 'thoracic spine mobility physical therapist', minutes: 6 },
  { id: 'lowerBack', name: '腰背部', en: 'LOWER BACK', latin: 'Erector spinae · Quadratus lumborum · Multifidus', short: '腰背', muscles: ['竖脊肌', '腰方肌', '多裂肌'], nerves: '脊神经后支 · 腰丛（示意）', description: '腰背承担着支撑与稳定身体的任务。动作保持舒缓，以自己的舒适范围为准。', causes: ['持续久坐', '长时间站立', '运动疲劳'], tip: '幅度小一点，也是一种进步。', query: 'low back pain stretches physical therapist', minutes: 8 },
  { id: 'arm', name: '上臂', en: 'UPPER ARMS', latin: 'Biceps brachii · Triceps brachii', short: '上臂', muscles: ['肱二头肌', '肱三头肌', '肱肌', '喙肱肌'], nerves: '肌皮神经 · 桡神经（示意）', description: '手臂肌群参与日常提、推和拉。放松训练后的紧绷，从温和活动开始。', causes: ['力量训练', '重复提物', '长时间屈肘'], tip: '肘关节保持自然，不要用力锁死。', query: 'biceps triceps stretch physical therapy', minutes: 5 },
  { id: 'forearm', name: '前臂与手腕', en: 'FOREARMS & WRISTS', latin: 'Wrist flexors · Wrist extensors', short: '前臂', muscles: ['腕屈肌群', '腕伸肌群', '旋前圆肌', '肱桡肌'], nerves: '正中神经 · 尺神经 · 桡神经（示意）', description: '键盘、鼠标和握持动作，都离不开前臂与手腕。给双手一次短暂的放松。', causes: ['键盘鼠标', '攀爬训练', '反复握持'], tip: '手指放松，避免用力牵拉手腕。', query: 'wrist forearm stretches physical therapist', minutes: 4 },
  { id: 'abs', name: '腹部', en: 'ABDOMINALS', latin: 'Rectus abdominis · Obliques · Transversus', short: '腹部', muscles: ['腹直肌', '腹外斜肌', '腹内斜肌', '腹横肌'], nerves: '胸腹神经（T7–T12）· 膈神经（示意）', description: '腹部肌群帮助躯干活动与稳定。寻找自然、舒适的活动范围。', causes: ['核心训练', '长期蜷坐', '躯干紧张'], tip: '不要用腰部过伸代替腹部舒展。', query: 'abdominal stretch physical therapy', minutes: 5 },
  { id: 'hip', name: '臀髋部', en: 'HIPS & GLUTES', latin: 'Gluteals · Iliopsoas · Piriformis', short: '臀髋', muscles: ['臀大肌', '臀中肌', '臀小肌', '髂腰肌', '梨状肌', '阔筋膜张肌'], nerves: '臀上神经 · 臀下神经 · 股神经 · 坐骨神经（示意）', description: '臀髋连接躯干与双腿。结束久坐后，用舒缓的活动找回髋部的灵活。', causes: ['久坐办公', '跑步训练', '长时间骑行'], tip: '稳住骨盆，让呼吸带动放松。', query: 'hip flexor piriformis stretch physical therapist', minutes: 8 },
  { id: 'thigh', name: '大腿', en: 'THIGHS', latin: 'Quadriceps · Hamstrings · Adductors', short: '大腿', muscles: ['股直肌', '股外侧肌', '股内侧肌', '股中间肌', '股二头肌', '半腱肌', '半膜肌', '内收肌群', '缝匠肌'], nerves: '股神经 · 坐骨神经 · 闭孔神经（示意）', description: '前侧、后侧与内侧肌群共同帮助双腿活动。根据紧绷位置，选择对应的示范。', causes: ['跑步骑行', '腿部训练', '长时间坐姿'], tip: '膝盖自然伸展，不要强行压直。', query: 'hamstring quad stretch physical therapist', minutes: 7 },
  { id: 'calf', name: '小腿与足部', en: 'CALVES & FEET', latin: 'Gastrocnemius · Soleus · Plantar fascia', short: '小腿', muscles: ['腓肠肌', '比目鱼肌', '胫骨前肌', '胫骨后肌', '腓骨肌群', '足底内在肌'], nerves: '胫神经 · 腓总神经（示意）', description: '从走路到跑跳，小腿持续参与发力。用有支撑的姿势，轻柔舒展。', causes: ['跑步跳跃', '长时间站立', '步行较多'], tip: '脚跟落稳，保持身体平衡。', query: 'calf stretch plantar fascia physical therapist', minutes: 5 },
];

export const platformSearch = (_platform, query) => `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;

// The atlas separates the visible surface layer from deeper stabilisers so the same
// body region can be explored at two useful teaching depths.
export const layerMuscles = {
  neck: { superficial: ['胸锁乳突肌', '斜方肌上束'], deep: ['肩胛提肌', '头长肌', '颈长肌', '头前直肌', '头外直肌', '前斜角肌', '中斜角肌'] },
  shoulder: { superficial: ['三角肌前束', '三角肌中束', '三角肌后束', '大圆肌'], deep: ['冈上肌', '冈下肌', '小圆肌', '肩胛下肌'] },
  chest: { superficial: ['胸大肌', '前锯肌'], deep: ['胸小肌', '锁骨下肌', '肋间外肌', '肋间内肌'] },
  upperBack: { superficial: ['斜方肌', '背阔肌'], deep: ['肩胛提肌', '大菱形肌', '小菱形肌', '冈下肌', '棘间肌'] },
  lowerBack: { superficial: ['背阔肌下部'], deep: ['髂肋肌', '最长肌', '棘肌', '腰方肌', '多裂肌', '回旋肌', '腰大肌'] },
  arm: { superficial: ['肱二头肌', '肱三头肌长头', '肱三头肌外侧头'], deep: ['喙肱肌', '肱肌', '肱三头肌内侧头'] },
  forearm: { superficial: ['肱桡肌', '旋前圆肌', '桡侧腕屈肌', '尺侧腕屈肌', '桡侧腕长伸肌', '指伸肌', '肘肌'], deep: ['旋前方肌', '拇长屈肌', '指深屈肌', '旋后肌', '拇长伸肌'] },
  abs: { superficial: ['腹直肌', '腹外斜肌'], deep: ['腹内斜肌', '腹横肌'] },
  hip: { superficial: ['臀大肌', '阔筋膜张肌', '臀中肌'], deep: ['腰大肌', '髂肌', '梨状肌', '闭孔内肌', '臀小肌', '股方肌'] },
  thigh: { superficial: ['股直肌', '股外侧肌', '股内侧肌', '缝匠肌', '股二头肌长头', '半腱肌', '内收长肌'], deep: ['股中间肌', '股二头肌短头', '半膜肌', '内收短肌', '内收大肌'] },
  calf: { superficial: ['腓肠肌内侧头', '腓肠肌外侧头', '胫骨前肌', '腓骨长肌', '腓骨短肌'], deep: ['比目鱼肌', '胫骨后肌', '趾长屈肌', '拇长屈肌', '腘肌'] },
};

export const publisherLabel = { PT: 'PT', MD: 'MD', hospital: '医院', publicHealth: 'NHS', university: '高校', clinic: '机构', professionalBody: '学会' };
export const publisherName = { PT: '物理治疗师', MD: '医师', hospital: '医院 / 骨科机构', publicHealth: '公共卫生机构', university: '高校', clinic: '康复机构', professionalBody: '专业学会' };
export const kinds = ['拉伸', '跟练', '活动度', '拉伸与力量', '康复讲解', '神经滑动'];

export const videos = videoCatalog.map(v => ({
  ...v,
  url: `https://www.youtube.com/watch?v=${v.id}`,
  thumbnail: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
  year: v.publishedAt ? Number(v.publishedAt.slice(0, 4)) : null,
}));

export const videosFor = id => videos.filter(v => v.regions.includes(id)).sort((a, b) => (b.publishedAt || '').localeCompare(a.publishedAt || ''));
