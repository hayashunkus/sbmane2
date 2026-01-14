import React, { useState, useEffect, useRef } from 'react';
import {
  Map,
  Ticket,
  Compass,
  Home,
  Search,
  Navigation,
  Coffee,
  ShoppingBag,
  Utensils,
  Clock,
  MapPin,
  ChevronRight,
  Bell,
  Star,
  Info,
  Menu,
  Smartphone,
  Package,
  Zap,
  AlertCircle,
  TrainFront,
  Calendar,
  ArrowRight,
  User,
  Settings,
  HelpCircle,
  FileText,
  LogOut,
  X,
  ExternalLink,
  Trash2,
  History,
  MessageSquare,
  Send,
  Bot,
  RefreshCw
} from 'lucide-react';

/**
 * 名古屋駅スマートコンシェルジュ (Nagoya Station Smart Concierge)
 * Update: 現在地からのプラン案内開始（スタート地点への誘導）
 */

// --- 定数データ (Data) ---

const COUPONS = [
  { id: 1, name: '矢場とん エスカ店', discount: '100円OFF', category: 'グルメ', image: '🐷', location: 'エスカ地下街', description: '名物みそかつ定食ご注文の方限定' },
  { id: 2, name: 'ぴよりんshop', discount: 'トッピング無料', category: 'カフェ', image: '🐥', location: '中央コンコース', description: 'ぴよりんサンデーご注文の方' },
  { id: 3, name: '高島屋 お土産フロア', discount: '5%OFF', category: 'ショッピング', image: '🎁', location: 'JRゲートタワー', description: '3,000円以上お買い上げの方' },
  { id: 4, name: 'きしめん 住よし', discount: '天ぷら1品無料', category: 'グルメ', image: '🍜', location: '新幹線ホーム', description: '麺類ご注文の方' },
];

const POPULAR_SPOTS = [
  { id: 1, name: 'ノリタケの森', description: '陶磁器の複合施設。散策やカフェが楽しめます', link: 'https://www.noritake.co.jp/mori/' },
  { id: 2, name: '大名古屋ビルヂング', description: '駅直結。最新グルメやショッピングが集結', link: 'https://dainagoyabuilding.com/' },
  { id: 3, name: 'ナナちゃん人形', description: '名古屋駅の待ち合わせシンボル。季節の衣装に注目', link: 'https://www.e-meitetsu.com/mds/f_nana/' },
  { id: 4, name: 'スカイプロムナード', description: 'ミッドランドスクエア44-46Fの屋外展望台', link: 'https://www.midland-square.com/sky-promenade/' },
];

const PLANS = [
  {
    id: 1,
    title: '90分で満喫！うまいもん＆デパ地下',
    duration: '90分',
    tags: ['グルメ', 'ショッピング', '定番'],
    color: 'bg-pink-100 text-pink-800',
    steps: [
      { time: '11:00', label: '中央コンコースからスタート', floor: '1F', x: 200, y: 300 },
      { time: '11:10', label: '「うまいもん通り」でひつまぶしランチ', floor: '1F', x: 80, y: 480 },
      { time: '12:00', label: 'JR名古屋タカシマヤへ移動', floor: '1F', x: 320, y: 300 },
      { time: '12:10', label: 'B1Fデパ地下で限定スイーツ探索', floor: 'B1F', x: 250, y: 150 },
    ]
  },
  {
    id: 2,
    title: '乗り換え60分！名物早食いプラン',
    duration: '60分',
    tags: ['グルメ', 'クイック'],
    color: 'bg-orange-100 text-orange-800',
    steps: [
      { time: '00:00', label: '新幹線改札口 到着', floor: '1F', x: 80, y: 390 },
      { time: '00:10', label: '「住よし」できしめん', floor: '1F', x: 100, y: 350 },
      { time: '00:30', label: 'グランドキヨスクでお土産', floor: '1F', x: 200, y: 250 },
      { time: '00:50', label: '新幹線ホームへ移動', floor: '1F', x: 80, y: 390 },
    ]
  },
  {
    id: 3,
    title: '雨に濡れずに！地下街ショッピング',
    duration: '3時間',
    tags: ['ショッピング', '雨の日OK'],
    color: 'bg-blue-100 text-blue-800',
    steps: [
      { time: '10:00', label: '金時計前 集合', floor: '1F', x: 200, y: 80 },
      { time: '10:15', label: 'ゲートタワーモールで買い物', floor: '1F', x: 80, y: 80 },
      { time: '11:30', label: 'サンロード地下街へ移動', floor: '1F', x: 200, y: 400 },
      { time: '12:00', label: '地下街でランチ', floor: 'B1F', x: 200, y: 400 },
    ]
  }
];

const SMART_SERVICES = [
  {
    id: 'piyorin',
    title: 'スマートぴよ約',
    description: '大行列のぴよりんを並ばずに受取り！',
    icon: <Smartphone size={20} />,
    color: 'bg-yellow-100 text-yellow-800',
    borderColor: 'border-yellow-200',
    badge: '予約推奨',
    action: '予約サイトへ',
    link: 'https://market.jr-central.co.jp/shop/e/epiyoyaku/'
  },
  {
    id: 'locker',
    title: 'ロッカーコンシェルジュ',
    description: '空きロッカーをリアルタイム検索・予約',
    icon: <Package size={20} />,
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-200',
    badge: '空きわずか',
    action: '探す',
    link: 'https://www.akilocker.biz/mobile/map.html?locationId=JR_NAGOYA&mapId=M32001&lang=1'
  },
  {
    id: 'ex_yoyaku',
    title: '新幹線EX予約',
    description: 'きっぷ売り場に並ばずスマホで改札タッチ',
    icon: <TrainFront size={20} />,
    color: 'bg-indigo-100 text-indigo-800',
    borderColor: 'border-indigo-200',
    badge: '便利',
    action: '連携',
    link: 'https://expy.jp/'
  }
];

const MAP_WIDTH = 400;
const MAP_HEIGHT = 600;

const MAP_PINS = [
  // 1F
  { id: 1, category: 'ランチ', floor: '1F', x: 80, y: 480, name: 'うまいもん通り(太閤)' },
  { id: 2, category: 'カフェ', floor: '1F', x: 320, y: 150, name: 'カフェ・ド・クリエ' },
  { id: 3, category: 'お土産', floor: '1F', x: 280, y: 300, name: 'ギフトキヨスク' },
  { id: 4, category: '案内所', floor: '1F', x: 200, y: 280, name: '総合案内所' },
  { id: 9, category: '待ち合わせ', floor: '1F', x: 200, y: 80, name: '金の時計' },
  { id: 10, category: '待ち合わせ', floor: '1F', x: 200, y: 520, name: '銀の時計' },

  // 2F
  { id: 5, category: 'カフェ', floor: '2F', x: 300, y: 200, name: 'タカシマヤ カフェ' },
  { id: 6, category: 'ランチ', floor: '2F', x: 100, y: 400, name: 'レストラン街' },

  // B1F
  { id: 7, category: 'ランチ', floor: 'B1F', x: 100, y: 450, name: 'エスカ地下街' },
  { id: 8, category: 'お土産', floor: 'B1F', x: 250, y: 150, name: '地下お土産売り場' },
];

// 混雑エリアの定義
const CONGESTION_ZONES = [
  // 1F: 中央口付近 (混雑: オレンジ) -> Index 0
  { x: 140, y: 230, r: 80, intensity: 0.6, floor: '1F', type: 'orange' },

  // 1F: 太閤通口付近/新幹線改札前 (やや混雑: 黄色) -> Index 1
  { x: 200, y: 500, r: 90, intensity: 0.6, floor: '1F', type: 'yellow' },

  // 2F: 桜通口 (混雑: オレンジ) -> Index 2
  { x: 200, y: 60, r: 90, intensity: 0.7, floor: '2F', type: 'orange' },

  // B1F: タカシマヤ (混雑: オレンジ) -> Index 3
  { x: 320, y: 300, r: 100, intensity: 0.8, floor: 'B1F', type: 'orange' },
];

// 注目エリアの定義
const FOCUS_AREAS = [
  { id: 'central', name: '中央口付近', relatedPlanId: 1, congestionIndex: 0, x: 200, y: 280, floor: '1F' },
  { id: 'shinkansen', name: '新幹線改札前', relatedPlanId: 2, congestionIndex: 1, x: 80, y: 390, floor: '1F' },
  { id: 'sakura', name: '桜通口付近', relatedPlanId: 3, congestionIndex: 2, x: 200, y: 60, floor: '2F' }
];

// --- コンポーネント (Components) ---

// ChatBot UI
const ChatBotModal = ({ isOpen, onClose, initialQuery }) => {
  const [messages, setMessages] = useState([
    { id: 1, text: 'こんにちは！名駅コンシェルジュAIです。\n駅構内や周辺のおすすめスポットをご案内します。', isBot: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && initialQuery) {
      handleSend(initialQuery);
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const userText = text || inputText;
    if (!userText.trim()) return;

    const newUserMsg = { id: Date.now(), text: userText, isBot: false };
    setMessages(prev => [...prev, newUserMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let botResponse = "申し訳ありません。その情報については現在確認中です。";

      if (userText.includes("ランチ") || userText.includes("ご飯")) {
        botResponse = "今の時間帯なら「うまいもん通り」がおすすめです。特に「スパゲッティハウス チャオ」のあんかけスパは名古屋名物として人気ですよ！";
      } else if (userText.includes("お土産") || userText.includes("赤福")) {
        botResponse = "お土産なら中央コンコースの「ギフトキヨスク」が品揃え豊富です。赤福やゆかりなどの定番は、朝10時前なら比較的並ばずに購入できます。";
      } else if (userText.includes("出口") || userText.includes("迷った")) {
        botResponse = "現在地はどちらですか？「金時計（桜通口）」なら東側、「銀時計（太閤通口）」なら西側（新幹線側）です。まずはどちらかの時計を目指すと分かりやすいですよ。";
      } else if (userText.includes("トイレ")) {
        botResponse = "1F中央コンコースの「金の時計」裏手、または「銀の時計」付近のエスカレーター横に公衆トイレがございます。";
      } else if (userText.includes("コインロッカー")) {
        botResponse = "コインロッカーをお探しですね。現在は「太閤通口（銀時計）」付近のロッカーに空きがあるようです。アプリ内の「ロッカーコンシェルジュ」もぜひ活用してください。";
      } else {
        botResponse = `「${userText}」についてですね。私の知識ベースを検索しましたが、詳細な情報が見当たりませんでした。案内所のスタッフにお繋ぎしましょうか？`;
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, text: botResponse, isBot: true }]);
      setIsTyping(false);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md h-[80vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-blue-600 p-4 flex justify-between items-center text-white shadow-md z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot size={20} />
            </div>
            <div>
              <h3 className="font-bold text-sm">名駅AIコンシェルジュ</h3>
              <p className="text-[10px] text-blue-100 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                駅情報データベース接続中
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${msg.isBot
                  ? 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                  : 'bg-blue-600 text-white rounded-tr-none'
                }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-gray-100 shadow-sm flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 bg-white border-t border-gray-100">
          <form
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="質問を入力してください..."
              className="flex-1 bg-gray-100 border-none rounded-full px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isTyping}
              className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send size={18} className={inputText.trim() ? 'ml-0.5' : ''} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// サイドメニュー項目
const MenuItem = ({ icon, label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-colors font-medium text-sm"
  >
    {icon}
    {label}
  </button>
);

// サイドメニュー本体
const SideMenu = ({ isOpen, onClose, onShowPopularSpots, onShowSavedCoupons, onShowHistory }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex justify-end">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      ></div>
      <div className="relative w-3/4 max-w-xs h-full bg-white shadow-2xl p-6 flex flex-col animate-in slide-in-from-right duration-300">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200">
          <X size={20} />
        </button>
        <div className="flex items-center gap-3 mb-8 mt-4 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 ring-4 ring-blue-50">
            <User size={24} />
          </div>
          <div>
            <p className="font-bold text-gray-800">ゲスト 様</p>
            <p className="text-xs text-blue-500 font-bold cursor-pointer">マイページを表示</p>
          </div>
        </div>
        <div className="space-y-1 flex-1 overflow-y-auto">
          <p className="text-xs font-bold text-gray-400 mb-2 px-3">メインメニュー</p>
          <MenuItem icon={<Star size={18} />} label="周辺の人気スポット" onClick={() => { onClose(); onShowPopularSpots(); }} />
          <MenuItem icon={<Ticket size={18} />} label="保存したクーポン" onClick={() => { onClose(); onShowSavedCoupons(); }} />
          <MenuItem icon={<History size={18} />} label="履歴・最近見たプラン" onClick={() => { onClose(); onShowHistory(); }} />
          <div className="h-px bg-gray-100 my-4 mx-3"></div>
          <p className="text-xs font-bold text-gray-400 mb-2 px-3">サポート・設定</p>
          <MenuItem icon={<Settings size={18} />} label="アプリ設定" onClick={onClose} />
          <MenuItem icon={<HelpCircle size={18} />} label="ヘルプ・よくある質問" onClick={onClose} />
          <MenuItem icon={<FileText size={18} />} label="利用規約・ポリシー" onClick={onClose} />
        </div>
        <button className="flex items-center gap-3 text-red-500 font-bold p-3 hover:bg-red-50 rounded-xl transition-colors mt-4 text-sm">
          <LogOut size={18} />
          ログアウト
        </button>
      </div>
    </div>
  );
};

// 汎用リストモーダル
const ListModal = ({ title, items, onClose, type, onRemove, onNavigate }) => (
  <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
      <div className="p-4 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100"><X size={20} className="text-gray-500" /></button>
      </div>
      <div className="p-4 overflow-y-auto space-y-3">
        {items.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-8">データがありません</p>
        ) : (
          items.map((item) => (
            <div key={item.id} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex gap-3 items-start relative group">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
                {type === 'coupon' ? item.image : type === 'history' ? <Clock size={20} className="text-blue-500" /> : <MapPin className="text-red-500" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-800 text-sm truncate">{type === 'history' ? item.title : item.name}</h4>
                  {type === 'coupon' && (
                    <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                  )}
                </div>
                {type === 'coupon' && <p className="text-orange-500 font-bold text-xs">{item.discount}</p>}
                {type === 'history' && <p className="text-xs text-gray-500 mt-1"><Clock size={10} className="inline mr-1" />{item.duration}</p>}
                {type !== 'history' && <p className="text-xs text-gray-500 mt-1 leading-snug line-clamp-2">{item.description}</p>}
                {type === 'spot' && (
                  <button onClick={() => window.open(item.link, '_blank')} className="mt-2 text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded flex items-center gap-1 w-fit hover:bg-blue-200 transition">
                    公式サイトを見る <ExternalLink size={10} />
                  </button>
                )}
                {type === 'coupon' && (
                  <button className="mt-2 bg-gray-800 text-white text-[10px] px-3 py-1 rounded-full hover:bg-gray-600 transition">今すぐ利用する</button>
                )}
                {type === 'history' && (
                  <button
                    onClick={() => onNavigate(item.id)}
                    className="mt-2 bg-blue-600 text-white text-[10px] px-3 py-1 rounded-full hover:bg-blue-700 transition flex items-center gap-1 w-fit"
                  >
                    プランに移動 <ArrowRight size={10} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </div>
);

const BeaconPopup = ({ coupon, onClose, onSave }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
    <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl transform transition-all scale-100 animate-in zoom-in-95 duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-yellow-200 rounded-full opacity-50 blur-2xl"></div>
      <div className="flex flex-col items-center text-center relative z-10">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white mb-4 animate-bounce">
          <Bell size={32} />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-1">近くのクーポンを発見！</h3>
        <p className="text-gray-500 text-sm mb-6">現在地の近くでお得なクーポンが使えます</p>
        <div className="bg-gray-50 rounded-xl p-4 w-full border border-gray-100 mb-6 flex items-center shadow-sm">
          <span className="text-4xl mr-4">{coupon.image}</span>
          <div className="text-left">
            <p className="font-bold text-gray-800">{coupon.name}</p>
            <p className="text-blue-600 font-bold">{coupon.discount}</p>
          </div>
        </div>
        <button onClick={() => { onSave(coupon); onClose(); }} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition active:scale-95">クーポンを保存する</button>
        <button onClick={onClose} className="mt-3 text-gray-400 text-sm hover:text-gray-600">閉じる</button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [showBeaconDemo, setShowBeaconDemo] = useState(false);
  const [currentFloor, setCurrentFloor] = useState('1F');
  const [targetTime, setTargetTime] = useState('');
  const [targetStation, setTargetStation] = useState('');
  const [optimizationResult, setOptimizationResult] = useState(null);
  const [now, setNow] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPinId, setSelectedPinId] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [savedCoupons, setSavedCoupons] = useState([]);
  const [historyPlans, setHistoryPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [focusedPlanId, setFocusedPlanId] = useState(null);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatQuery, setInitialChatQuery] = useState('');

  const [currentFocusArea, setCurrentFocusArea] = useState(() => {
    const randomIndex = Math.floor(Math.random() * FOCUS_AREAS.length);
    return FOCUS_AREAS[randomIndex];
  });

  const planRefs = useRef({});

  // Update: 現在地を「現在のステータス」の場所に合わせる
  const currentLocation = activePlan
    ? { x: currentFocusArea.x, y: currentFocusArea.y, floor: currentFocusArea.floor } // プラン開始しても現在地は動かない
    : { x: currentFocusArea.x, y: currentFocusArea.y, floor: currentFocusArea.floor };

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (activeTab === 'plans' && focusedPlanId && planRefs.current[focusedPlanId]) {
      setTimeout(() => {
        planRefs.current[focusedPlanId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [activeTab, focusedPlanId]);

  const getCongestionInfo = (area) => {
    const zone = CONGESTION_ZONES[area.congestionIndex];
    if (zone.type === 'orange') return { label: '混雑', color: 'text-red-500' };
    if (zone.type === 'yellow') return { label: '普通', color: 'text-yellow-600' };
    return { label: '空き', color: 'text-blue-500' };
  };

  const sortedPlans = [...PLANS].sort((a, b) => {
    if (a.id === currentFocusArea.relatedPlanId) return -1;
    if (b.id === currentFocusArea.relatedPlanId) return 1;
    return 0;
  });

  const formatTime = (date) => date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  const triggerBeaconDemo = () => setShowBeaconDemo(true);

  const handleSaveCoupon = (coupon) => {
    if (!savedCoupons.some(c => c.id === coupon.id)) {
      setSavedCoupons([...savedCoupons, coupon]);
      alert('クーポンを保存しました！メニューから確認できます。');
    } else {
      alert('このクーポンは既に保存されています。');
    }
  };

  const handleRemoveCoupon = (id) => setSavedCoupons(savedCoupons.filter(c => c.id !== id));

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (searchQuery.length > 50) {
        alert('検索ワードが長すぎます。50文字以内で入力してください。');
        return;
      }
      setInitialChatQuery(searchQuery);
      setIsChatOpen(true);
      setSearchQuery('');
    }
  };

  const handleShowPlanDetail = (planId) => {
    setFocusedPlanId(planId);
    setActiveTab('plans');
  };

  const handleStartPlan = (plan) => {
    setHistoryPlans(prev => {
      const filtered = prev.filter(p => p.id !== plan.id);
      return [plan, ...filtered];
    });
    setFocusedPlanId(null);
    setActivePlan(plan);
    setActiveTab('map');

    // Update: 案内開始時は現在地のあるフロアを表示する
    // スタート地点ではなく、ユーザーがいる現在地のフロアを表示
    setCurrentFloor(currentFocusArea.floor);

    setSelectedCategory(null);
    setSelectedPinId(null);
  };

  const handleHistoryNavigate = (planId) => {
    setActiveModal(null);
    handleShowPlanDetail(planId);
  };

  const handleStopPlan = () => setActivePlan(null);

  const calculateOptimizedPlan = () => {
    if (!targetTime) return;
    const [targetHour, targetMin] = targetTime.split(':').map(Number);
    const targetDate = new Date(now);
    targetDate.setHours(targetHour, targetMin, 0);
    const limitDate = new Date(targetDate);
    limitDate.setMinutes(limitDate.getMinutes() - 15);
    const diffMs = limitDate - now;
    const remainingMinutes = Math.floor(diffMs / 60000);

    let recommendationText = "";
    if (remainingMinutes < 0) recommendationText = "急いでください！改札への移動時間を考慮すると出発時刻ギリギリです。";
    else if (remainingMinutes < 30) recommendationText = `あと${remainingMinutes}分です。ホーム上の「住よし」で名物きしめんをサクッと啜るのが最適解！`;
    else if (remainingMinutes < 45) recommendationText = `${remainingMinutes}分あれば、グランドキヨスクでお土産をじっくり選べます。赤福もまだあるかも？`;
    else if (remainingMinutes < 60) recommendationText = `${remainingMinutes}分ですね！エスカ地下街で「矢場とん」の味噌カツを食べるチャンスです。`;
    else if (remainingMinutes < 90) recommendationText = `${remainingMinutes}分あれば余裕です。高島屋51Fのカフェで絶景を楽しんでみては？`;
    else if (remainingMinutes < 180) recommendationText = "90分以上あります！ゲートタワーモールでショッピングと食事をフルコースで満喫できます。";
    else recommendationText = "3時間以上の大休憩！タクシーで「ノリタケの森」や「名古屋城」まで観光に行けますよ！";

    setOptimizationResult({
      limitTime: formatTime(limitDate),
      currentTime: formatTime(now),
      station: targetStation || '目的地',
      departureTime: targetTime,
      remainingMinutes: remainingMinutes > 0 ? remainingMinutes : 0,
      recommendation: recommendationText
    });
  };

  const createPath = (start, end) => {
    const startOffset = { x: start.x, y: start.y - 20 };
    return `M ${startOffset.x} ${startOffset.y} L 200 ${startOffset.y} L 200 ${end.y} L ${end.x} ${end.y}`;
  };

  const createPlanPath = (steps) => {
    const floorSteps = steps.filter(s => s.floor === currentFloor);
    if (floorSteps.length < 2) return '';
    let path = `M ${floorSteps[0].x} ${floorSteps[0].y}`;
    for (let i = 1; i < floorSteps.length; i++) {
      path += ` L 200 ${floorSteps[i - 1].y} L 200 ${floorSteps[i].y} L ${floorSteps[i].x} ${floorSteps[i].y}`;
    }
    return path;
  };

  const getPos = (x, y) => ({
    left: `${(x / MAP_WIDTH) * 100}%`,
    top: `${(y / MAP_HEIGHT) * 100}%`
  });

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 pb-24">
            {/* Header */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">名駅コンシェルジュ <Star size={16} className="text-yellow-300 fill-yellow-300" /></h1>
                  <p className="text-blue-100 text-sm">Welcome back!</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm cursor-pointer hover:bg-white/30 transition-colors" onClick={() => setIsMenuOpen(true)}><Menu size={24} /></div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 border border-white/20">
                <MessageSquare className="text-blue-200" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch}
                  maxLength={50}
                  placeholder="AIに質問... (例: おすすめランチ)"
                  className="bg-transparent text-white placeholder-blue-200 w-full outline-none"
                />
              </div>
            </div>

            <div className="px-6">
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2"><Clock size={18} className="text-blue-500" />現在のステータス</h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">通常運行中</span>
                </div>
                <div className="mb-4 text-center bg-blue-50 py-3 rounded-xl border border-blue-100">
                  <p className="text-xs text-gray-500 mb-1 font-bold">滞在予測時間</p>
                  <p className="text-3xl font-extrabold text-blue-600 tracking-tight">{optimizationResult ? optimizationResult.remainingMinutes : '--'} <span className="text-sm text-gray-500 ml-1 font-bold">分</span></p>
                </div>
                <div className="flex items-center text-sm text-gray-600 border-t pt-4">
                  <div className="flex-1 text-center"><p className="font-bold text-lg text-gray-900">{formatTime(now)}</p><p className="text-xs">現在時刻</p></div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="flex-1 text-center">
                    <p className={`font-bold text-lg ${getCongestionInfo(currentFocusArea).color}`}>{getCongestionInfo(currentFocusArea).label}</p>
                    <p className="text-xs">{currentFocusArea.name}</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="flex-1 text-center"><p className="font-bold text-lg text-gray-900">晴れ</p><p className="text-xs">名古屋市</p></div>
                </div>
              </div>
            </div>

            <div className="pl-6">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">おすすめプラン</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 pr-6 scrollbar-hide">
                {sortedPlans.map(plan => (
                  <div key={plan.id} className="min-w-[260px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer" onClick={() => handleShowPlanDetail(plan.id)}>
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-20 transition-transform group-hover:scale-110 ${plan.color.split(' ')[0]}`}></div>
                    <div>
                      <div className="flex gap-2 mb-2">{plan.tags.map(tag => (<span key={tag} className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded-full text-gray-600">{tag}</span>))}</div>
                      <h4 className="font-bold text-gray-800 leading-tight mb-1">{plan.title}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1"><Clock size={12} /> 所要時間: {plan.duration}</p>
                    </div>
                    <button className="text-blue-600 text-sm font-bold flex items-center self-end">詳細を見る <ChevronRight size={16} /></button>
                  </div>
                ))}
              </div>
            </div>

            <div className="px-6 grid grid-cols-4 gap-4">
              {[
                { icon: <Utensils size={24} />, label: 'ランチ', color: 'bg-orange-100 text-orange-600' },
                { icon: <Coffee size={24} />, label: 'カフェ', color: 'bg-green-100 text-green-700' },
                { icon: <ShoppingBag size={24} />, label: 'お土産', color: 'bg-pink-100 text-pink-600' },
                { icon: <Info size={24} />, label: '案内所', color: 'bg-blue-100 text-blue-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2" onClick={() => { setSelectedCategory(item.label); setActiveTab('map'); setCurrentFloor(currentLocation.floor); }}>
                  <div className={`${item.color} p-4 rounded-2xl shadow-sm active:scale-95 transition-transform cursor-pointer`}>{item.icon}</div>
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="px-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 p-3 border-b border-gray-100 flex items-center gap-2"><Calendar size={18} className="text-blue-600" /><h3 className="text-sm font-bold text-gray-700">次の予定から最適プラン作成</h3></div>
                {!optimizationResult ? (
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-3">乗車予定を入力すると、最適な過ごし方を提案します</p>
                    <div className="flex gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">時間</label>
                        <input type="time" value={targetTime} onChange={(e) => setTargetTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500" />
                      </div>
                      <div className="flex-[1.5] min-w-0 ml-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">行き先/駅名</label>
                        <input type="text" placeholder="例: 東京駅" value={targetStation} onChange={(e) => setTargetStation(e.target.value)} maxLength={20} className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500" />
                      </div>
                    </div>
                    <button onClick={calculateOptimizedPlan} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm active:scale-95 transition-transform">プランを提案する</button>
                  </div>
                ) : (
                  <div className="p-0">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                      <div className="flex items-center justify-between text-blue-900 mb-4">
                        <div className="text-center"><p className="text-[10px] text-blue-400 font-bold mb-1">NOW</p><p className="text-xl font-bold leading-none">{optimizationResult.currentTime}</p></div>
                        <div className="flex-1 px-4 flex flex-col items-center">
                          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-1 shadow-sm ${optimizationResult.remainingMinutes > 30 ? 'bg-green-500' : optimizationResult.remainingMinutes > 15 ? 'bg-yellow-500' : 'bg-red-500'}`}>残り {optimizationResult.remainingMinutes}分</div>
                          <div className="w-full h-1 bg-blue-200 rounded-full relative"><div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div></div>
                          <p className="text-[10px] text-blue-400 mt-1">移動 15分</p>
                        </div>
                        <div className="text-center"><p className="text-[10px] text-red-400 font-bold mb-1">LIMIT</p><p className="text-xl font-bold leading-none text-red-500">{optimizationResult.limitTime}</p></div>
                      </div>
                      <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1"><Compass size={20} /></div>
                        <div><p className="text-xs font-bold text-blue-600 mb-1">おすすめの過ごし方</p><p className="text-sm font-bold text-gray-800 leading-snug">{optimizationResult.recommendation}</p></div>
                      </div>
                      <div className="mt-3 flex justify-between items-center border-t border-blue-100/50 pt-2"><p className="text-xs text-blue-800 font-bold flex items-center gap-1"><TrainFront size={14} /> {optimizationResult.departureTime}発 {optimizationResult.station}行</p><button onClick={() => setOptimizationResult(null)} className="text-xs text-gray-400 underline">リセット</button></div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 flex-shrink-0 animate-pulse"><AlertCircle size={20} /></div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">混雑検知: ぴよりんShop</h3>
                    <p className="text-xs text-gray-600 mb-2">現在、待機列が<span className="font-bold text-red-500">60分以上</span>発生しています。</p>
                    <div className="bg-white p-3 rounded-xl border border-yellow-200 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-yellow-50 transition-colors" onClick={() => window.open('https://market.jr-central.co.jp/shop/e/epiyoyaku/', '_blank')}>
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">🐥</div>
                      <div className="flex-1"><p className="font-bold text-gray-800 text-sm">スマートぴよ約</p><p className="text-[10px] text-gray-500">並ばずに無人ロッカーで受取り</p></div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pl-6">
              <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2"><Zap size={18} className="text-yellow-500 fill-yellow-500" />スマート活用術</h3>
              <div className="flex overflow-x-auto gap-3 pb-4 pr-6 scrollbar-hide">
                {SMART_SERVICES.map(service => (
                  <div key={service.id} className={`min-w-[200px] bg-white p-4 rounded-2xl shadow-sm border ${service.borderColor} flex flex-col justify-between relative group cursor-pointer`} onClick={() => service.link && window.open(service.link, '_blank')}>
                    <div className="mb-2">
                      <div className={`w-8 h-8 rounded-full ${service.color} flex items-center justify-center mb-3`}>{service.icon}</div>
                      <h4 className="font-bold text-gray-800 text-sm leading-tight mb-1">{service.title}</h4>
                      <p className="text-[10px] text-gray-500 leading-snug">{service.description}</p>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[10px] font-bold bg-gray-100 px-2 py-1 rounded-full text-gray-600">{service.badge}</span>
                      <span className="text-xs text-blue-600 font-bold">{service.action}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        );

      case 'map':
        return (
          <div className="h-full flex flex-col bg-gray-50">
            <div className="p-4 bg-white shadow-sm z-10">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-gray-800">駅構内マップ</h2>
                {selectedCategory && (
                  <button onClick={() => { setSelectedCategory(null); setSelectedPinId(null); }} className="bg-gray-800 text-white text-[10px] px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                    {selectedCategory} ✕
                  </button>
                )}
                {activePlan && (
                  <button onClick={handleStopPlan} className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                    {activePlan.title.substring(0, 8)}... 終了 ✕
                  </button>
                )}
              </div>
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {['B1F', '1F', '2F'].map(floor => (
                  <button key={floor} onClick={() => setCurrentFloor(floor)} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${currentFloor === floor ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>{floor}</button>
                ))}
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 relative bg-gray-100">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden flex flex-col" style={{ minHeight: '600px' }}>
                <svg viewBox="0 0 400 600" className="w-full h-full absolute top-0 left-0 z-0 bg-gray-50">
                  <defs>
                    <radialGradient id="congestionGradientOrange" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="congestionGradientYellow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                      <stop offset="0%" stopColor="#eab308" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                    </radialGradient>
                  </defs>

                  <rect x="160" y="50" width="80" height="500" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                  <rect x="20" y="20" width="360" height="100" rx="4" fill="#eff6ff" stroke="#bfdbfe" />
                  <text x="200" y="45" textAnchor="middle" fontSize="12" fill="#1e40af" fontWeight="bold">桜通口 (Gold Clock)</text>
                  <text x="200" y="65" textAnchor="middle" fontSize="10" fill="#60a5fa">JRゲートタワー / 高島屋</text>
                  <rect x="20" y="480" width="360" height="100" rx="4" fill="#f0fdf4" stroke="#bbf7d0" />
                  <text x="200" y="550" textAnchor="middle" fontSize="12" fill="#166534" fontWeight="bold">太閤通口 (Silver Clock)</text>
                  <text x="200" y="570" textAnchor="middle" fontSize="10" fill="#4ade80">新幹線 / あおなみ線</text>
                  <rect x="20" y="320" width="120" height="140" rx="4" fill="#e5e7eb" stroke="#9ca3af" />
                  <text x="80" y="390" textAnchor="middle" fontSize="10" fill="#4b5563" fontWeight="bold" style={{ writingMode: 'vertical-rl' }}>新幹線改札</text>
                  <rect x="20" y="160" width="120" height="140" rx="4" fill="#e0f2fe" stroke="#7dd3fc" />
                  <text x="80" y="230" textAnchor="middle" fontSize="10" fill="#0369a1" fontWeight="bold" style={{ writingMode: 'vertical-rl' }}>JR線 中央改札</text>
                  <rect x="260" y="140" width="120" height="320" rx="4" fill="#fdf2f8" stroke="#fbcfe8" />
                  <text x="320" y="300" textAnchor="middle" fontSize="10" fill="#db2777" fontWeight="bold" style={{ writingMode: 'vertical-rl' }}>JR名古屋タカシマヤ</text>
                  <rect x="20" y="480" width="100" height="80" rx="4" fill="#ffedd5" stroke="#fed7aa" opacity="0.8" />
                  <text x="70" y="520" textAnchor="middle" fontSize="9" fill="#c2410c">うまいもん通り</text>

                  {CONGESTION_ZONES
                    .filter(zone => zone.floor === currentFloor)
                    .map((zone, idx) => (
                      <circle
                        key={idx}
                        cx={zone.x}
                        cy={zone.y}
                        r={zone.r}
                        fill={zone.type === 'yellow' ? "url(#congestionGradientYellow)" : "url(#congestionGradientOrange)"}
                        style={{ opacity: zone.intensity }}
                      />
                    ))
                  }

                  {selectedPinId && (
                    <>
                      <style>{`@keyframes dash { to { stroke-dashoffset: -20; } } .animate-dash { animation: dash 1s linear infinite; }`}</style>
                      <path d={createPath(currentLocation, MAP_PINS.find(p => p.id === selectedPinId))} stroke="#2563eb" strokeWidth="4" fill="none" strokeDasharray="8 4" className="animate-dash" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx={currentLocation.x} cy={currentLocation.y} r="6" fill="#2563eb" stroke="white" strokeWidth="2" />
                    </>
                  )}
                  {activePlan && (
                    <>
                      <style>{`@keyframes dash { to { stroke-dashoffset: -20; } } .animate-dash { animation: dash 1s linear infinite; }`}</style>
                      <path
                        d={createPlanPath(activePlan.steps)}
                        stroke="#3b82f6"
                        strokeWidth="5"
                        fill="none"
                        strokeDasharray="8 4"
                        className="animate-dash"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* Update: 現在地からスタート地点への線を描画 (同じフロアの場合) */}
                      {currentLocation.floor === activePlan.steps[0].floor && currentFloor === currentLocation.floor && (
                        <path
                          d={createPath(currentLocation, activePlan.steps[0])}
                          stroke="#3b82f6"
                          strokeWidth="5"
                          fill="none"
                          strokeDasharray="8 4"
                          className="animate-dash"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      )}
                    </>
                  )}
                </svg>
                <div className="absolute inset-0 z-10 pointer-events-none">
                  {currentLocation.floor === currentFloor && (
                    <div className="absolute flex flex-col items-center justify-center transform -translate-x-1/2 -translate-y-1/2 transition-all duration-500 pointer-events-auto cursor-pointer" style={getPos(currentLocation.x, currentLocation.y)} onClick={() => setSelectedPinId(null)}>
                      <div className="w-12 h-12 bg-blue-600/20 rounded-full animate-ping absolute"></div>
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg border-2 border-white relative z-20"><Navigation size={14} className="text-white transform -rotate-45" fill="currentColor" /></div>
                      <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded absolute top-8 mt-1 whitespace-nowrap shadow-lg z-30">現在地</div>
                    </div>
                  )}

                  {!activePlan && MAP_PINS.filter(pin => pin.floor === currentFloor).map(pin => {
                    const isTarget = selectedCategory === pin.category || selectedPinId === pin.id;
                    const opacity = (selectedCategory && !isTarget) ? 'opacity-30' : 'opacity-100';
                    const scale = isTarget ? 'scale-110 z-50' : 'scale-100 z-30';
                    const bounce = isTarget ? 'animate-bounce' : '';
                    return (
                      <div key={pin.id} className={`absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-full transition-all duration-300 pointer-events-auto cursor-pointer ${opacity} ${scale}`} style={getPos(pin.x, pin.y)} onClick={() => setSelectedPinId(pin.id)}>
                        <div className={`relative ${bounce}`}><MapPin size={36} className="text-red-600 fill-white drop-shadow-md" /><div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rounded-full"></div></div>
                        <span className="bg-white/95 px-2 py-1 rounded-md text-[9px] font-bold text-gray-800 shadow-md whitespace-nowrap mt-1 border border-gray-100">{pin.name}</span>
                      </div>
                    );
                  })}
                  {activePlan && activePlan.steps.map((step, idx) => {
                    if (step.floor !== currentFloor) return null;
                    return (
                      <div key={idx} className="absolute flex flex-col items-center transform -translate-x-1/2 -translate-y-full z-40" style={getPos(step.x, step.y)}>
                        <div className="relative">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-lg border-2 border-white">{idx + 1}</div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="mt-1 bg-white/95 px-2 py-1 rounded-md shadow-md border border-blue-100 text-center">
                          <p className="text-[10px] font-bold text-gray-800 whitespace-nowrap">{step.label}</p>
                          <p className="text-[9px] text-blue-600 font-bold">{step.time}</p>
                        </div>
                      </div>
                    );
                  })
                  }
                </div>
              </div>

              <div className="mt-4 px-2">
                <div className="flex justify-between items-end mb-1">
                  <span className="text-[10px] font-bold text-gray-500">空き</span>
                  <span className="text-[10px] font-bold text-gray-500">混雑</span>
                </div>
                <div className="h-2 rounded-full w-full bg-gradient-to-r from-blue-400 via-yellow-400 to-orange-500"></div>
                <p className="text-center text-[10px] text-gray-400 mt-2">※ リアルタイムの混雑状況（デモ）</p>
              </div>

            </div>
          </div>
        );

      case 'coupon':
        return (
          <div className="pb-24">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-white rounded-b-[2rem] shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-2">クーポン</h2>
              <p className="text-white/90 text-sm">現在地周辺のお得な情報が見つかります</p>
              <button onClick={triggerBeaconDemo} className="mt-4 w-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/40 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"><Bell size={18} className="animate-bounce" /> ビーコン検知デモを実行</button>
            </div>
            <div className="px-4 space-y-4">
              <div className="flex justify-between items-end px-2"><h3 className="font-bold text-gray-800">配布中のクーポン</h3><span className="text-xs text-gray-500">{COUPONS.length}件</span></div>
              {COUPONS.map(coupon => (
                <div key={coupon.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center relative overflow-hidden">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">{coupon.image}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start"><span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded mb-1 inline-block">{coupon.category}</span><span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> {coupon.location}</span></div>
                    <h4 className="font-bold text-gray-800">{coupon.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center pl-2 border-l border-dashed border-gray-200 min-w-[80px]"><span className="text-orange-500 font-bold text-lg">{coupon.discount}</span><button className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full mt-2 hover:bg-gray-700 transition">利用する</button></div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'plans':
        return (
          <div className="pb-24">
            <div className="p-6 bg-white sticky top-0 z-10 border-b border-gray-100"><h2 className="text-2xl font-bold text-gray-800 mb-2">おすすめプラン</h2><p className="text-gray-500 text-sm">空き時間に合わせた最適な過ごし方</p></div>
            <div className="p-4 space-y-6">
              {PLANS.map((plan) => (
                <div key={plan.id} ref={el => planRefs.current[plan.id] = el} className={`bg-white rounded-2xl shadow-sm border overflow-hidden transition-all duration-500 ${focusedPlanId === plan.id ? 'border-blue-500 ring-4 ring-blue-100 scale-100' : 'border-gray-200'}`}>
                  <div className={`p-4 ${plan.color} flex justify-between items-center`}><h3 className="font-bold text-lg">{plan.title}</h3><div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">{plan.duration}</div></div>
                  <div className="p-5">
                    <div className="relative border-l-2 border-gray-200 ml-3 my-2 space-y-6">
                      {plan.steps.map((step, idx) => (
                        <div key={idx} className="relative pl-6"><div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-400"></div><span className="text-xs font-bold text-gray-400 block mb-1">{step.time}</span><p className="text-sm font-medium text-gray-800">{step.label}</p></div>
                      ))}
                    </div>
                    <button onClick={() => handleStartPlan(plan)} className="w-full mt-4 border border-gray-300 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50 transition">このプランで案内開始</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default: return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] bg-gray-50 flex flex-col relative font-sans text-gray-900 overflow-hidden">
      <div className="flex-1 overflow-y-auto scrollbar-hide">{renderContent()}</div>

      <SideMenu
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onShowPopularSpots={() => setActiveModal('popular')}
        onShowSavedCoupons={() => setActiveModal('saved')}
        onShowHistory={() => setActiveModal('history')}
      />

      <ChatBotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialQuery={initialChatQuery}
      />

      {activeModal === 'popular' && (
        <ListModal title="周辺の人気スポット" items={POPULAR_SPOTS} type="spot" onClose={() => setActiveModal(null)} />
      )}

      {activeModal === 'saved' && (
        <ListModal title="保存したクーポン" items={savedCoupons} type="coupon" onClose={() => setActiveModal(null)} onRemove={handleRemoveCoupon} />
      )}

      {activeModal === 'history' && (
        <ListModal
          title="履歴・最近見たプラン"
          items={historyPlans}
          type="history"
          onClose={() => setActiveModal(null)}
          onNavigate={handleHistoryNavigate}
        />
      )}

      <div className="bg-white border-t border-gray-200 pt-2 px-6 pb-[env(safe-area-inset-bottom,16px)] flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
        {[{ id: 'home', icon: <Home size={24} />, label: 'ホーム' }, { id: 'map', icon: <Map size={24} />, label: 'マップ' }, { id: 'coupon', icon: <Ticket size={24} />, label: 'クーポン' }, { id: 'plans', icon: <Compass size={24} />, label: 'プラン' }].map(item => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex flex-col items-center p-2 transition-all duration-300 ${activeTab === item.id ? 'text-blue-600 -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}>
            {item.icon}<span className="text-[10px] font-bold mt-1">{item.label}</span>{activeTab === item.id && <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>}
          </button>
        ))}
      </div>
      {showBeaconDemo && (
        <BeaconPopup coupon={COUPONS[0]} onClose={() => setShowBeaconDemo(false)} onSave={handleSaveCoupon} />
      )}
    </div>
  );
}