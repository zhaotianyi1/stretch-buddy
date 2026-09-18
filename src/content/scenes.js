// 日常场景 → 首选部位。minutes 由该部位的日常方案总时长计算。
export const scenes = [
  { id: 'desk', label: '伏案久坐', sub: '肩颈发紧、肩胛之间酸胀', region: 'neck', icon: 'Armchair' },
  { id: 'phone', label: '手机低头', sub: '颈根酸、后脑勺发紧', region: 'neck', icon: 'Smartphone' },
  { id: 'mouse', label: '鼠标与键盘', sub: '前臂发酸、手腕不适', region: 'forearm', icon: 'MousePointer2' },
  { id: 'run', label: '跑步之后', sub: '小腿沉重、跟腱发紧', region: 'calf', icon: 'Footprints' },
  { id: 'gym', label: '推举训练后', sub: '胸前、肩前打不开', region: 'chest', icon: 'Dumbbell' },
  { id: 'stand', label: '久站一天', sub: '腰部两侧酸、小腿胀', region: 'lowerBack', icon: 'Clock3' },
  { id: 'morning', label: '晨起僵硬', sub: '髋前打不开、腰部发紧', region: 'hip', icon: 'Sunrise' },
  { id: 'drive', label: '长途驾驶 / 飞行', sub: '上背驼、大腿后侧紧', region: 'upperBack', icon: 'Car' },
];
