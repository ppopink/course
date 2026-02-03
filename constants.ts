
import { Level, Difficulty, Language } from './types';

export const LANGUAGE_THEMES: Record<Language, string> = {
  [Language.PYTHON]: 'from-blue-400 to-emerald-400',
  [Language.C]: 'from-slate-300 to-indigo-400',
  [Language.JAVA]: 'from-orange-400 to-red-500'
};

export const LEVELS: Record<Language, Level[]> = {
  [Language.PYTHON]: [
    // 第一章：蛇语契约
    { id: 1, chapterId: 1, chapterTitle: "第一章：蛇语契约", title: "1-1 自由的标签", topic: "动态类型", description: "在 Python 中，同一个标签可以贴在不同类型的物体上。", instruction: "观察代码，补全输出语句：", type: 'fill', template: "a = 1\na = \"text\"\nprint({{0}})", placeholders: ["a"], difficulty: Difficulty.BEGINNER, points: 10 },
    { id: 2, chapterId: 1, chapterTitle: "第一章：蛇语契约", title: "1-2 缩进的法则", topic: "Indentation", description: "缩进决定了代码属于哪个魔法块。", instruction: "属于 if 内部的代码块应该？", type: 'choice', options: ["向左推一格", "向右推一个缩进", "不需要缩进", "用大括号包裹"], difficulty: Difficulty.EASY, points: 15 },
    { id: 3, chapterId: 1, chapterTitle: "第一章：蛇语契约", title: "1-3 字符串魔法", topic: "f-string", description: "使用 f-string 可以将变量直接注入字符串。", instruction: "补全代码输出 'Hello Neo'：", type: 'fill', template: "name = \"Neo\"\nprint(f\"Hello {{0}}\")", placeholders: ["{name}"], difficulty: Difficulty.MEDIUM, points: 15 },
    // 第二章：空间背包
    { id: 4, chapterId: 2, chapterTitle: "第二章：空间背包", title: "2-1 万能收纳", topic: "List Append", description: "用列表 basket 接住掉下来的 apple。", instruction: "补全添加元素的魔法：", type: 'fill', template: "basket = []\nbasket.{{0}}('apple')", placeholders: ["append"], difficulty: Difficulty.EASY, points: 15 },
    { id: 5, chapterId: 2, chapterTitle: "第二章：空间背包", title: "2-2 激光切割", topic: "Slicing", description: "激光切割 [start:end] 可以提取列表的一部分。", instruction: "提取 [0,1,2,3,4] 中的 [1,2]，切片是？", type: 'fill', template: "nums = [0, 1, 2, 3, 4]\nsub = nums[{{0}}:{{1}}]", placeholders: ["1", "3"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 6, chapterId: 2, chapterTitle: "第二章：空间背包", title: "2-3 倒序咒语", topic: "Negative Index", description: "使用负索引 [-1] 拿取最后一个人。", instruction: "补全获取末尾元素的索引：", type: 'fill', template: "team = ['A', 'B', 'C']\nlast = team[{{0}}]", placeholders: ["-1"], difficulty: Difficulty.MEDIUM, points: 20 },
    // 第三章：真名法典
    { id: 7, chapterId: 3, chapterTitle: "第三章：真名法典", title: "3-1 键值对应", topic: "Dict Definition", description: "法典让每一个键都有对应的真意。", instruction: "补全字典定义：", type: 'fill', template: "student = {\"Name\": \"Tom\", \"{{0}}\": 18}", placeholders: ["Age"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 8, chapterId: 3, chapterTitle: "第三章：真名法典", title: "3-2 快速查询", topic: "Key Access", description: "通过键直接查询值。", instruction: "获取 student 的 age 值：", type: 'fill', template: "val = student['{{0}}']", placeholders: ["Age"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 9, chapterId: 3, chapterTitle: "第三章：真名法典", title: "3-3 存在的证明", topic: "in Keyword", description: "使用 in 关键字判断键是否存在。", instruction: "判断 'Score' 是否在字典中：", type: 'fill', template: "is_in = 'Score' {{0}} student", placeholders: ["in"], difficulty: Difficulty.MEDIUM, points: 20 },
    // 第四章：流动的魔力
    { id: 10, chapterId: 4, chapterTitle: "第四章：流动的魔力", title: "4-1 遍历万物", topic: "For Loop", description: "让每个元素都答“到”。", instruction: "补全遍历循环：", type: 'fill', template: "for x {{0}} list:\n    print(x)", placeholders: ["in"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 11, chapterId: 4, chapterTitle: "第四章：流动的魔力", title: "4-2 数字范围", topic: "range()", description: "range(0, 5) 产生的最后一个数字是？", instruction: "选择 range 的范围逻辑：", type: 'choice', options: ["包含 5", "不包含 5", "包含 6", "从 1 开始"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 12, chapterId: 4, chapterTitle: "第四章：流动的魔力", title: "4-3 一行奇迹", topic: "List Comprehension", description: "将 3 行循环压缩成 1 行。", instruction: "补全列表推导式：", type: 'fill', template: "new_list = [x*2 {{0}} x in old_list]", placeholders: ["for"], difficulty: Difficulty.HARD, points: 30 },
    // 第六章：英灵殿的召唤
    { id: 13, chapterId: 6, chapterTitle: "第六章：英灵殿的召唤", title: "6-1 呼唤外援", topic: "Import", description: "想算根号，选 math 卡牌。", instruction: "导入模块的关键字是？", type: 'fill', template: "{{0}} math", placeholders: ["import"], difficulty: Difficulty.EASY, points: 15 },
    { id: 14, chapterId: 6, chapterTitle: "第六章：英灵殿的召唤", title: "6-2 别名的艺术", isBoss: true, topic: "Import As", description: "把复杂的模块缩写成契约名。", instruction: "补全模块缩写咒语：", type: 'fill', template: "import pandas {{0}} pd", placeholders: ["as"], difficulty: Difficulty.HARD, points: 40 }
  ],
  [Language.C]: [
    // 第一章：元素周期表
    { id: 1, chapterId: 1, chapterTitle: "第一章：元素周期表", title: "1-1 容器的形状", topic: "Variables & Types", description: "区分 int, float, char。", instruction: "把 3.14 放入正确的瓶子：", type: 'choice', options: ["int", "float", "char", "void"], difficulty: Difficulty.BEGINNER, points: 10 },
    { id: 2, chapterId: 1, chapterTitle: "第一章：元素周期表", title: "1-2 命名的禁忌", topic: "Naming Rules", description: "变量名不能以数字开头。", instruction: "以下哪个命名是非法的？", type: 'choice', options: ["count", "_total", "2pack", "sum_1"], difficulty: Difficulty.EASY, points: 15 },
    { id: 3, chapterId: 1, chapterTitle: "第一章：元素周期表", title: "1-3 赋值的仪式", topic: "Assignment", description: "理解 '=' 是赋值而非相等。", instruction: "a=10; a=a+5; 最终 a 是？", type: 'choice', options: ["10", "5", "15", "0"], difficulty: Difficulty.EASY, points: 15 },
    { id: 4, chapterId: 1, chapterTitle: "第一章：元素周期表", title: "1-4 溢出的代价", isBoss: true, topic: "Overflow", description: "超过范围会发生什么？", instruction: "short 存入 32768 会？", type: 'choice', options: ["报错", "变成 0", "变成负数", "变成 1"], difficulty: Difficulty.HARD, points: 40 },
    // 第二章：熔炉的刻度
    { id: 5, chapterId: 2, chapterTitle: "第二章：熔炉的刻度", title: "2-1 第一次点火", topic: "Printf", description: "printf 基本用法。", instruction: "补全换行符：", type: 'fill', template: "printf(\"Hello{{0}}\");", placeholders: ["\\n"], difficulty: Difficulty.EASY, points: 10 },
    { id: 6, chapterId: 2, chapterTitle: "第二章：熔炉的刻度", title: "2-2 占位符匹配", topic: "Formatters", description: "匹配 %d, %f, %c。", instruction: "输出整数应选？", type: 'choice', options: ["%f", "%d", "%c", "%s"], difficulty: Difficulty.EASY, points: 15 },
    { id: 7, chapterId: 2, chapterTitle: "第二章：熔炉的刻度", title: "2-3 精度的提炼", topic: "Precision", description: "保留两位小数。", instruction: "补全格式化代码：", type: 'fill', template: "printf(\"{{0}}\", 3.14159);", placeholders: ["%.2f"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 8, chapterId: 2, chapterTitle: "第二章：熔炉的刻度", title: "2-4 元素的注入", topic: "Scanf", description: "scanf 与 & 取地址符。", instruction: "找茬：scanf(\"%d\", a); 错在？", type: 'choice', options: ["多了分号", "少了 &", "格式符不对", "没定义 a"], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第三章：逻辑齿轮
    { id: 9, chapterId: 3, chapterTitle: "第三章：逻辑齿轮", title: "3-1 命运的分岔", topic: "If-Else", description: "if (score >= 60) 判断流向。", instruction: "score=59, 程序走哪个分支？", type: 'choice', options: ["if", "else", "都不走", "报错"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 10, chapterId: 3, chapterTitle: "第三章：逻辑齿轮", title: "3-2 多重开关", topic: "Switch-Case", description: "理解 break 的防止穿透作用。", instruction: "补全防止穿透的关键字：", type: 'fill', template: "case 1:\n    ...;\n    {{0}};", placeholders: ["break"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 11, chapterId: 3, chapterTitle: "第三章：逻辑齿轮", title: "3-3 逻辑组合", topic: "Logic Operators", description: "&& (与), || (或), ! (非)。", instruction: "同时满足 A 和 B，使用？", type: 'choice', options: ["||", "&&", "!", "=="], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第四章：无限回廊
    { id: 12, chapterId: 4, chapterTitle: "第四章：无限回廊", title: "4-1 永恒的圆", topic: "While Loop", description: "i=0; while(i<3) printf(\"%d\", i++); 输出？", instruction: "预测结果：", type: 'choice', options: ["0123", "012", "123", "333"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 13, chapterId: 4, chapterTitle: "第四章：无限回廊", title: "4-2 计数的步伐", topic: "For Loop", description: "for 循环语法结构。", instruction: "补全 for 语句头：", type: 'fill', template: "for (i=0; i<10; {{0}})", placeholders: ["i++"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 14, chapterId: 4, chapterTitle: "第四章：无限回廊", title: "4-3 紧急逃生", topic: "Break/Continue", description: "理解 break 与 continue 的差异。", instruction: "跳过本次循环用？", type: 'choice', options: ["break", "continue", "exit", "return"], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第五章：合成卷轴
    { id: 15, chapterId: 5, chapterTitle: "第五章：合成卷轴", title: "5-1 咒语的定义", topic: "Functions", description: "函数声明与定义。", instruction: "补全返回整数的函数头：", type: 'fill', template: "{{0}} add(int a, int b)", placeholders: ["int"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 16, chapterId: 5, chapterTitle: "第五章：合成卷轴", title: "5-2 虚空的反馈", topic: "Void & Return", description: "void 函数不能返回具体值。", instruction: "无返回值的函数类型是？", type: 'fill', template: "{{0}} run()", placeholders: ["void"], difficulty: Difficulty.EASY, points: 20 },
    { id: 17, chapterId: 5, chapterTitle: "第五章：合成卷轴", title: "5-3 替身与真身", topic: "Pass by Value", description: "函数内修改形参不影响外部实参。", instruction: "魔术题：形参 a=99, 实参 a 会变吗？", type: 'choice', options: ["会变", "不会变", "看情况", "报错"], difficulty: Difficulty.HARD, points: 30 },
    // 第六章：储存柜的秘密
    { id: 18, chapterId: 6, chapterTitle: "第六章：储存柜的秘密", title: "6-1 序列的创建", topic: "Arrays", description: "数组声明。", instruction: "创建存 3 个整数的数组：", type: 'fill', template: "int arr[{{0}}];", placeholders: ["3"], difficulty: Difficulty.EASY, points: 15 },
    { id: 19, chapterId: 6, chapterTitle: "第六章：储存柜的秘密", title: "6-2 危险的边缘", topic: "Index Bounds", description: "下标越界检查。", instruction: "arr[3] 只有 3 个元素，合法下标最高是？", type: 'choice', options: ["0", "1", "2", "3"], difficulty: Difficulty.MEDIUM, points: 20 },
    { id: 20, chapterId: 6, chapterTitle: "第六章：储存柜的秘密", title: "6-3 字符的终结", topic: "String Null", description: "字符串末尾的 \\0。", instruction: "\"Hi\" 在内存占几个字节？", type: 'choice', options: ["2", "3", "4", "1"], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第七章：贤者之石
    { id: 21, chapterId: 7, chapterTitle: "第七章：贤者之石", title: "7-1 门牌号", topic: "Address-of", description: "& 取地址。", instruction: "获取 a 的地址用？", type: 'fill', template: "p = {{0}}a;", placeholders: ["&"], difficulty: Difficulty.HARD, points: 30 },
    { id: 22, chapterId: 7, chapterTitle: "第七章：贤者之石", title: "7-2 钥匙的使用", topic: "Dereference", description: "* 解引用。", instruction: "修改指针 p 指向的内容：", type: 'fill', template: "{{0}}p = 100;", placeholders: ["*"], difficulty: Difficulty.HARD, points: 30 },
    { id: 23, chapterId: 7, chapterTitle: "第七章：贤者之石", title: "7-3 指针移动", topic: "Pointer Arithmetic", description: "int *p; p++ 跳几个字节？", instruction: "选择字节数：", type: 'choice', options: ["1", "2", "4", "8"], difficulty: Difficulty.HARD, points: 35 },
    { id: 24, chapterId: 7, chapterTitle: "第七章：贤者之石", isBoss: true, title: "7-4 数组的面具", topic: "Array Pointers", description: "数组名即指针。", instruction: "arr 等于什么？", type: 'choice', options: ["&arr[0]", "arr[0]", "*arr", "&arr"], difficulty: Difficulty.HARD, points: 50 }
  ],
  [Language.JAVA]: [
    // 第一章：基石奠基
    { id: 1, chapterId: 1, chapterTitle: "第一章：基石奠基", title: "1-1 严苛的规格", topic: "Types", description: "强类型检查。", instruction: "哪行会报错？", type: 'choice', options: ["int a=1;", "int a=\"H\";", "double b=1.1;", "String c=\"H\";"], difficulty: Difficulty.BEGINNER, points: 15 },
    { id: 2, chapterId: 1, chapterTitle: "第一章：基石奠基", title: "1-2 入口的指令", topic: "Main Method", description: "补全超长咒语：", instruction: "主方法头：", type: 'fill', template: "public static void {{0}}(String[] args)", placeholders: ["main"], difficulty: Difficulty.EASY, points: 20 },
    // 第二章：造物主蓝图
    { id: 3, chapterId: 2, chapterTitle: "第二章：造物主蓝图", title: "2-1 绘制图纸", topic: "Class Definition", description: "设计士兵类。", instruction: "补全类定义关键字：", type: 'fill', template: "public {{0}} Soldier {}", placeholders: ["class"], difficulty: Difficulty.EASY, points: 20 },
    { id: 4, chapterId: 2, chapterTitle: "第二章：造物主蓝图", title: "2-2 实体化", topic: "New Object", description: "点击 new 生产士兵。", instruction: "实例化关键字是？", type: 'fill', template: "Soldier s = {{0}} Soldier();", placeholders: ["new"], difficulty: Difficulty.EASY, points: 20 },
    { id: 5, chapterId: 2, chapterTitle: "第二章：造物主蓝图", title: "2-3 指针的遥控", topic: "References", description: "s1 = s2 后，s1 指向？", instruction: "选择引用逻辑：", type: 'choice', options: ["s2的对象", "新副本", "空", "s1原本的"], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第三章：皇家血脉
    { id: 6, chapterId: 3, chapterTitle: "第三章：皇家血脉", title: "3-1 血统延续", topic: "Inheritance", description: "Archer 继承 Soldier。", instruction: "继承关键字：", type: 'fill', template: "class Archer {{0}} Soldier", placeholders: ["extends"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 7, chapterId: 3, chapterTitle: "第三章：皇家血脉", title: "3-2 基因突变", topic: "Override", description: "修改父类攻击逻辑。", instruction: "这种行为被称为？", type: 'choice', options: ["Override", "Overload", "Hide", "New"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 8, chapterId: 3, chapterTitle: "第三章：皇家血脉", title: "3-3 祖先的召唤", topic: "super Keyword", description: "调用父类构造函数。", instruction: "补全调用语句：", type: 'fill', template: "{{0}}();", placeholders: ["super"], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第四章：骑士的誓言
    { id: 9, chapterId: 4, chapterTitle: "第四章：骑士的誓言", title: "4-1 签订契约", topic: "Interfaces", description: "定义 Flyable 接口。", instruction: "接口关键字：", type: 'fill', template: "public {{0}} Flyable", placeholders: ["interface"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 10, chapterId: 4, chapterTitle: "第四章：骑士的誓言", title: "4-2 履行义务", topic: "Implements", description: "Bird 实现了 Flyable。", instruction: "实现接口关键字：", type: 'fill', template: "class Bird {{0}} Flyable", placeholders: ["implements"], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第六章：城堡的壁垒
    { id: 11, chapterId: 6, chapterTitle: "第六章：城堡的壁垒", title: "6-1 权力的边界", topic: "Access Control", description: "锁门！money 属性设为私有。", instruction: "私有化关键字：", type: 'fill', template: "{{0}} double money;", placeholders: ["private"], difficulty: Difficulty.MEDIUM, points: 25 },
    { id: 12, chapterId: 6, chapterTitle: "第六章：城堡的壁垒", title: "6-2 传话筒", topic: "Getter/Setter", description: "外部修改 hp 必须通过方法。", instruction: "补全 Setter 方法名：", type: 'fill', template: "public void {{0}}(int h) { this.hp = h; }", placeholders: ["setHp"], difficulty: Difficulty.MEDIUM, points: 25 },
    // 第七章：通天塔建设
    { id: 13, chapterId: 7, chapterTitle: "第七章：通天塔建设", title: "7-1 动态军团", topic: "ArrayList", description: "长度可变的集合。", instruction: "补全集合类型名：", type: 'fill', template: "{{0}}<String> list = new {{0}}<>();", placeholders: ["ArrayList"], difficulty: Difficulty.MEDIUM, points: 30 },
    { id: 14, chapterId: 7, chapterTitle: "第七章：通天塔建设", title: "7-2 键值宝库", isBoss: true, topic: "HashMap", description: "根据 ID 查找档案。", instruction: "存储 ID 到档案的集合是？", type: 'choice', options: ["ArrayList", "HashMap", "HashSet", "LinkedList"], difficulty: Difficulty.HARD, points: 40 }
  ]
};
