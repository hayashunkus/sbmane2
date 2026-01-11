import React, { useState, useEffect } from 'react';
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
  ArrowRight
} from 'lucide-react';

/**
 * 名古屋駅スマートコンシェルジュ (Nagoya Station Smart Concierge)
 * Update: スマートぴ予約などの混雑回避サービスを強化
 */

// --- モックデータ (Mock Data) ---
const MAP_PINS = [
  // 1F
  { id: 1, category: 'ランチ', floor: '1F', top: '40%', left: '20%', name: 'うまいもん通り' },
  { id: 2, category: 'カフェ', floor: '1F', top: '55%', left: '60%', name: 'カフェ・ド・クリエ' },
  { id: 3, category: 'お土産', floor: '1F', top: '30%', left: '75%', name: 'ギフトキヨスク' },
  { id: 4, category: '案内所', floor: '1F', top: '48%', left: '48%', name: '総合案内所' },
  // 2F
  { id: 5, category: 'カフェ', floor: '2F', top: '30%', left: '30%', name: 'タカシマヤ カフェ' },
  { id: 6, category: 'ランチ', floor: '2F', top: '60%', left: '60%', name: 'レストラン街' },
  // B1F
  { id: 7, category: 'ランチ', floor: 'B1F', top: '40%', left: '30%', name: 'エスカ地下街' },
  { id: 8, category: 'お土産', floor: 'B1F', top: '70%', left: '50%', name: '地下お土産売り場' },
];

const COUPONS = [
  { id: 1, name: '矢場とん エスカ店', discount: '100円OFF', category: 'グルメ', image: '🐷', location: 'エスカ地下街', description: '名物みそかつ定食ご注文の方限定' },
  { id: 2, name: 'ぴよりんshop', discount: 'トッピング無料', category: 'カフェ', image: '🐥', location: '中央コンコース', description: 'ぴよりんサンデーご注文の方' },
  { id: 3, name: '高島屋 お土産フロア', discount: '5%OFF', category: 'ショッピング', image: '🎁', location: 'JRゲートタワー', description: '3,000円以上お買い上げの方' },
  { id: 4, name: 'きしめん 住よし', discount: '天ぷら1品無料', category: 'グルメ', image: '🍜', location: '新幹線ホーム', description: '麺類ご注文の方' },
];

const PLANS = [
  {
    id: 1,
    title: '90分で満喫！うまいもん＆デパ地下',
    duration: '90分',
    tags: ['グルメ', 'ショッピング', '定番'],
    color: 'bg-pink-100 text-pink-800',
    steps: [
      { time: '11:00', label: '中央コンコースからスタート' },
      { time: '11:10', label: '「うまいもん通り」でひつまぶしランチ' },
      { time: '12:00', label: 'JR名古屋タカシマヤへ移動' },
      { time: '12:10', label: 'B1Fデパ地下で限定スイーツ探索' },
    ]
  },
  {
    id: 2,
    title: '乗り換え60分！名物早食いプラン',
    duration: '60分',
    tags: ['グルメ', 'クイック'],
    color: 'bg-orange-100 text-orange-800',
    steps: [
      { time: '00:00', label: '新幹線改札口 到着' },
      { time: '00:10', label: '「住よし」できしめんを啜る' },
      { time: '00:30', label: 'グランドキヨスクでお土産購入' },
      { time: '00:50', label: '新幹線ホームへ移動' },
    ]
  },

  {
    id: 3,
    title: '雨に濡れずに！地下街ショッピング',
    duration: '3時間',
    tags: ['ショッピング', '雨の日OK'],
    color: 'bg-blue-100 text-blue-800',
    steps: [
      { time: '10:00', label: '金時計前 集合' },
      { time: '10:15', label: 'ゲートタワーモールでウィンドウショッピング' },
      { time: '11:30', label: 'サンロード地下街へ移動' },
      { time: '12:00', label: '地下街でランチ' },
    ]
  },
];

// スマートサービス（混雑回避系）
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
    description: '空きロッカーをリアルタイム検索',
    icon: <Package size={20} />,
    color: 'bg-blue-100 text-blue-800',
    borderColor: 'border-blue-200',
    badge: '空きわずか',
    action: '探す',
    link: 'https://www.akilocker.biz/mobile/area.html?locationId=JR_NAGOYA&lang=1'
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

// --- コンポーネント (Components) ---

const BeaconPopup = ({ coupon, onClose }) => (
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

        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg transform transition active:scale-95"
        >
          クーポンを保存する
        </button>
        <button
          onClick={onClose}
          className="mt-3 text-gray-400 text-sm hover:text-gray-600"
        >
          閉じる
        </button>
      </div>
    </div>
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showBeaconDemo, setShowBeaconDemo] = useState(false);
  const [currentFloor, setCurrentFloor] = useState('1F');

  // 新機能: スケジュール最適化用のステート
  const [targetTime, setTargetTime] = useState('');
  const [targetStation, setTargetStation] = useState('');
  const [optimizationResult, setOptimizationResult] = useState(null);

  // 現在時刻の管理 (リアルタイム更新)
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    // 1秒ごとに時刻を更新
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 時刻フォーマット関数 (HH:mm)
  const formatTime = (date) => {
    return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  };

  // 擬似的なビーコン検知デモ
  const triggerBeaconDemo = () => {
    setShowBeaconDemo(true);
  };

  // スケジュール最適化計算（現在時刻と連動）
  const calculateOptimizedPlan = () => {
    if (!targetTime) return;

    // 入力されたターゲット時間をDateオブジェクトに変換（日付は今日とする）
    const [targetHour, targetMin] = targetTime.split(':').map(Number);
    const targetDate = new Date(now);
    targetDate.setHours(targetHour, targetMin, 0);

    // もしターゲット時刻が現在より過去の場合、翌日として扱うなどの処理も可能だが
    // ここでは簡易的に当日として計算（マイナスになる場合は考慮）

    // リミット時間の計算（移動15分前）
    const limitDate = new Date(targetDate);
    limitDate.setMinutes(limitDate.getMinutes() - 15);

    // 残り時間（分）の計算
    const diffMs = limitDate - now;
    const remainingMinutes = Math.floor(diffMs / 60000);

    let recommendationText = "";
    if (remainingMinutes < 0) {
      recommendationText = "急いでください！改札への移動時間を考慮すると出発時刻ギリギリです。";
    } else if (remainingMinutes < 30) {
      recommendationText = `あと${remainingMinutes}分です。ホーム上の「住よし」で名物きしめんをサクッと啜るのが最適解！`;
    } else if (remainingMinutes < 45) {
      recommendationText = `${remainingMinutes}分あれば、グランドキヨスクでお土産をじっくり選べます。赤福もまだあるかも？`;
    } else if (remainingMinutes < 60) {
      recommendationText = `${remainingMinutes}分ですね！エスカ地下街で「矢場とん」の味噌カツを食べるチャンスです。`;
    } else if (remainingMinutes < 90) {
      recommendationText = `${remainingMinutes}分あれば余裕です。高島屋51Fのカフェで絶景を楽しんでみては？`;
    } else if (remainingMinutes < 180) {
      recommendationText = "90分以上あります！ゲートタワーモールでショッピングと食事をフルコースで満喫できます。";
    } else {
      recommendationText = "3時間以上の大休憩！タクシーで「ノリタケの森」や「名古屋城」まで観光に行けますよ！";
    }

    setOptimizationResult({
      limitTime: formatTime(limitDate),
      station: targetStation || '目的地',
      departureTime: targetTime,
      remainingMinutes: remainingMinutes > 0 ? remainingMinutes : 0,
      recommendation: recommendationText
    });
  };

  const handleSearch = (e) => {
    // Enterキーが押され、かつ文字が入力されている場合のみ実行
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Googleで「site:www.meieki.com キーワード」の形式で検索させるURLを作成
      const url = `https://www.google.com/search?q=site:www.meieki.com+${encodeURIComponent(searchQuery)}`;
      // 新しいタブで開く
      window.open(url, '_blank');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6 pb-24">
            {/* Header / Hero */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 text-white p-6 rounded-b-[2rem] shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
              <div className="flex justify-between items-center mb-6 relative z-10">
                <div>
                  <h1 className="text-2xl font-bold flex items-center gap-2">
                    名駅コンシェルジュ
                    <Star size={16} className="text-yellow-300 fill-yellow-300" />
                  </h1>
                  <p className="text-blue-100 text-sm">Welcome back!</p>
                </div>
                <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                  <Menu size={24} />
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 flex items-center gap-3 border border-white/20">
                <Search className="text-blue-200" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearch} // Enterキーの入力を検知
                  placeholder="気になること検索..."
                  className="bg-transparent text-white placeholder-blue-200 w-full outline-none"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="px-6 grid grid-cols-4 gap-4">
              {[
                { icon: <Utensils size={24} />, label: 'ランチ', color: 'bg-orange-100 text-orange-600' },
                { icon: <Coffee size={24} />, label: 'カフェ', color: 'bg-green-100 text-green-700' },
                { icon: <ShoppingBag size={24} />, label: 'お土産', color: 'bg-pink-100 text-pink-600' },
                { icon: <Info size={24} />, label: '案内所', color: 'bg-blue-100 text-blue-600' },
              ].map((item, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2">
                  <div
                    onClick={() => {
                      setSelectedCategory(item.label); // カテゴリーをセット
                      setActiveTab('map');             // マップタブへ移動
                      setCurrentFloor('1F');           // とりあえず1Fを表示
                    }}
                    className={`${item.color} p-4 rounded-2xl shadow-sm active:scale-95 transition-transform cursor-pointer`}
                  >
                    {item.icon}
                  </div>
                  <span className="text-xs font-medium text-gray-600">{item.label}</span>
                </div>
              ))}
            </div>
            {/* ▼▼▼ ここから追加（次の予定から逆算セクション） ▼▼▼ */}
            <div className="px-6">
              <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                <div className="bg-gray-50 p-3 border-b border-gray-100 flex items-center gap-2">
                  <Calendar size={18} className="text-blue-600" />
                  <h3 className="text-sm font-bold text-gray-700">次の予定から最適プラン作成</h3>
                </div>

                {!optimizationResult ? (
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-3">乗車予定を入力すると、最適な過ごし方を提案します</p>

                    <div className="flex gap-4 mb-3">
                      <div className="flex-1 min-w-0">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">時間</label>
                        <input
                          type="time"
                          value={targetTime}
                          onChange={(e) => setTargetTime(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm font-bold text-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="flex-[1.5] min-w-0 ml-2">
                        <label className="text-[10px] font-bold text-gray-400 block mb-1">行き先/駅名</label>
                        <input
                          type="text"
                          placeholder="例: 東京駅"
                          value={targetStation}
                          onChange={(e) => setTargetStation(e.target.value)}
                          className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2 text-sm text-gray-800 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={calculateOptimizedPlan}
                      className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-xl text-sm shadow-sm active:scale-95 transition-transform"
                    >
                      プランを提案する
                    </button>
                  </div>
                ) : (
                  <div className="p-0">
                    <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
                      {/* Ticket-like view */}
                      <div className="flex items-center justify-between text-blue-900 mb-4">
                        <div className="text-center">
                          <p className="text-[16px] text-blue-400 font-bold mb-1">NOW</p>
                          {/* ★ここで計算時の時刻を表示
                          <p className="text-xl font-bold leading-none">{optimizationResult.currentTime}</p> */}
                        </div>
                        <div className="flex-1 px-4 flex flex-col items-center">
                          <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white mb-1 shadow-sm ${optimizationResult.remainingMinutes > 30 ? 'bg-green-500' : optimizationResult.remainingMinutes > 15 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                            残り {optimizationResult.remainingMinutes}分
                          </div>
                          <div className="w-full h-1 bg-blue-200 rounded-full relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <p className="text-[10px] text-blue-400 mt-1">移動 15分</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-red-400 font-bold mb-1">LIMIT</p>
                          <p className="text-xl font-bold leading-none text-red-500">{optimizationResult.limitTime}</p>
                        </div>
                      </div>

                      <div className="bg-white p-3 rounded-xl shadow-sm border border-blue-100 flex items-start gap-3">
                        <div className="bg-blue-100 p-2 rounded-lg text-blue-600 mt-1">
                          <Compass size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-600 mb-1">おすすめの過ごし方</p>
                          <p className="text-sm font-bold text-gray-800 leading-snug">
                            {optimizationResult.recommendation}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 flex justify-between items-center border-t border-blue-100/50 pt-2">
                        <p className="text-xs text-blue-800 font-bold flex items-center gap-1">
                          <TrainFront size={14} />
                          {optimizationResult.departureTime}発 {optimizationResult.station}行
                        </p>
                        <button
                          onClick={() => setOptimizationResult(null)}
                          className="text-xs text-gray-400 underline"
                        >
                          リセット
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* ▲▲▲ ここまで追加 ▲▲▲ */}

            {/* Smart Alert & Recommendation (New Feature) */}
            <div className="px-6">
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-100 rounded-2xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="bg-red-100 p-2 rounded-full text-red-600 flex-shrink-0 animate-pulse">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800 text-sm mb-1">混雑検知: ぴよりんShop</h3>
                    <p className="text-xs text-gray-600 mb-2">現在、待機列が<span className="font-bold text-red-500">60分以上</span>発生しています。</p>

                    {/* Smart Piyo-Yoyaku Card */}
                    <div className="bg-white p-3 rounded-xl border border-yellow-200 shadow-sm flex items-center gap-3 cursor-pointer hover:bg-yellow-50 transition-colors"
                      onClick={() => window.open('https://market.jr-central.co.jp/shop/e/epiyoyaku/', '_blank')}
                    >
                      <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl flex-shrink-0">
                        🐥
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 text-sm">スマートぴよ約</p>
                        <p className="text-[10px] text-gray-500">並ばずに無人ロッカーで受取り</p>
                      </div>
                      <ChevronRight size={16} className="text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Current Status Info */}
              <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Clock size={18} className="text-blue-500" />
                    現在のステータス
                  </h3>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">通常運行中</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 border-t pt-4">
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-900">{formatTime(now)}</p>
                    <p className="text-xs">現在時刻</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-900">混雑</p>
                    <p className="text-xs">中央口付近</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <div className="text-center">
                    <p className="font-bold text-lg text-gray-900">晴れ</p>
                    <p className="text-xs">名古屋市</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Services List */}
            <div className="pl-6">
              <h3 className="font-bold text-gray-800 mb-3 text-lg flex items-center gap-2">
                <Zap size={18} className="text-yellow-500 fill-yellow-500" />
                スマート活用術
              </h3>
              <div className="flex overflow-x-auto gap-3 pb-4 pr-6 scrollbar-hide">
                {SMART_SERVICES.map(service => (
                  <div key={service.id} className={`min-w-[200px] bg-white p-4 rounded-2xl shadow-sm border ${service.borderColor} flex flex-col justify-between relative group cursor-pointer`}
                    onClick={() => service.link && window.open(service.link, '_blank')}
                  >
                    <div className="mb-2">
                      <div className={`w-8 h-8 rounded-full ${service.color} flex items-center justify-center mb-3`}>
                        {service.icon}
                      </div>
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

            {/* Plans Scroll */}
            <div className="pl-6">
              <h3 className="font-bold text-gray-800 mb-3 text-lg">おすすめプラン</h3>
              <div className="flex overflow-x-auto gap-4 pb-4 pr-6 scrollbar-hide">
                {PLANS.map(plan => (
                  <div key={plan.id} className="min-w-[260px] bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between h-40 relative overflow-hidden group cursor-pointer" onClick={() => { setActiveTab('plans'); }}>
                    <div className={`absolute top-0 right-0 w-24 h-24 rounded-full -mr-8 -mt-8 opacity-20 transition-transform group-hover:scale-110 ${plan.color.split(' ')[0]}`}></div>
                    <div>
                      <div className="flex gap-2 mb-2">
                        {plan.tags.map(tag => (
                          <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-gray-100 rounded-full text-gray-600">{tag}</span>
                        ))}
                      </div>
                      <h4 className="font-bold text-gray-800 leading-tight mb-1">{plan.title}</h4>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock size={12} /> 所要時間: {plan.duration}
                      </p>
                    </div>
                    <button className="text-blue-600 text-sm font-bold flex items-center self-end">
                      詳細を見る <ChevronRight size={16} />
                    </button>
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
                {/* 絞り込み解除ボタン */}
                {selectedCategory && (
                  <button onClick={() => setSelectedCategory(null)} className="bg-gray-800 text-white text-[10px] px-3 py-1.5 rounded-full shadow flex items-center gap-1">
                    {selectedCategory} ✕
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
              {/* 地図コンテナ: relativeをつけることで中のabsoluteなピンがこれと一緒に動く */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] relative overflow-hidden flex flex-col">

                {/* --- マップ上のピン描画 (地図内部に配置) --- */}
                {MAP_PINS
                  .filter(pin => pin.floor === currentFloor)
                  .map(pin => {
                    const isTarget = selectedCategory === pin.category;
                    // カテゴリー選択中は、対象外のピンを薄くする（非表示にはしない）
                    const opacity = selectedCategory && !isTarget ? 'opacity-20' : 'opacity-100';
                    const scale = isTarget ? 'scale-110 z-50' : 'scale-100 z-30';

                    return (
                      <div
                        key={pin.id}
                        className={`absolute flex flex-col items-center transition-all duration-500 ${opacity} ${scale}`}
                        style={{ top: pin.top, left: pin.left }}
                      >
                        <div className={`relative ${isTarget ? 'animate-bounce' : ''}`}>
                          <MapPin size={32} className="text-red-600 fill-white drop-shadow-md" />
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-red-600 rounded-full"></div>
                        </div>
                        <span className="bg-white/90 px-1.5 py-0.5 rounded text-[8px] font-bold text-gray-800 shadow-sm whitespace-nowrap mt-1 border border-gray-100">
                          {pin.name}
                        </span>
                      </div>
                    );
                  })
                }

                {/* --- 地図のグラフィック --- */}
                <div className={`bg-blue-50 p-6 border-b-4 border-dashed border-blue-200 text-center relative transition-opacity ${currentFloor === '1F' ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="flex justify-between absolute top-4 left-4 right-4 text-xs font-bold text-gray-500">
                    <span className="bg-white/80 px-2 py-1 rounded border shadow-sm">ゲートタワー</span>
                    <span className="bg-white/80 px-2 py-1 rounded border shadow-sm">高島屋</span>
                  </div>
                  <div className="inline-block mt-6">
                    <div className="w-12 h-12 bg-yellow-400 text-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg ring-4 ring-yellow-100"><Clock size={24} strokeWidth={2.5} /></div>
                    <h3 className="font-bold text-blue-900 text-lg">桜通口 (Gold Clock)</h3>
                    <p className="text-[10px] text-blue-600 font-bold">東側エリア</p>
                  </div>
                </div>

                <div className="flex-1 bg-yellow-50 relative flex justify-center py-6 overflow-visible">
                  <div className="h-full w-32 bg-white border-x-2 border-dashed border-yellow-200 absolute left-1/2 -translate-x-1/2 top-0 bottom-0"></div>
                  <div className="z-10 flex flex-col items-center justify-between h-full w-full py-4 gap-8">
                    <div className="relative w-full flex justify-center">
                      <div className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md text-xs font-bold flex items-center gap-2 transform hover:scale-105 transition-transform"><Ticket size={14} /> JR線 中央改札</div>
                    </div>
                    <div className="relative w-full flex justify-center pl-24">
                      <div className="bg-white px-3 py-2 rounded-xl shadow-md border border-yellow-300 flex items-center gap-2 text-xs font-bold transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                        <span className="text-xl bg-yellow-100 rounded-full p-1">🐥</span>
                        <div><span className="block text-gray-800">ぴよりんshop</span><span className="text-[9px] text-red-500">行列注意</span></div>
                      </div>
                    </div>
                    <div className="relative w-full flex justify-center pr-24">
                      <div className="bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-xs font-bold text-gray-600">🎁 お土産街道</div>
                    </div>
                  </div>
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-full animate-ping absolute top-0 left-0"></div>
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-xl border-4 border-white relative z-10"><Navigation size={20} className="text-white transform -rotate-45" fill="currentColor" /></div>
                    <div className="bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap shadow-lg">現在地: コンコース中央</div>
                  </div>
                </div>

                <div className={`bg-green-50 p-6 border-t-4 border-dashed border-green-200 text-center relative transition-opacity ${currentFloor === '1F' ? 'opacity-100' : 'opacity-60'}`}>
                  <div className="flex justify-between absolute bottom-4 left-4 right-4 text-xs font-bold text-gray-500">
                    <span className="bg-white/80 px-2 py-1 rounded border shadow-sm">あおなみ線</span>
                    <span className="bg-white/80 px-2 py-1 rounded border shadow-sm">新幹線改札</span>
                  </div>
                  <div className="inline-block mb-6">
                    <h3 className="font-bold text-green-900 text-lg">太閤通口 (Silver Clock)</h3>
                    <p className="text-[10px] text-green-700 font-bold mb-2">西側・新幹線エリア</p>
                    <div className="w-12 h-12 bg-gray-300 text-white rounded-full flex items-center justify-center mx-auto shadow-lg ring-4 ring-gray-100"><Clock size={24} strokeWidth={2.5} /></div>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-center"><p className="text-xs text-gray-400 mb-2">※ 中央コンコースを直線で表現した簡易マップです</p></div>
            </div>
          </div>
        );

      case 'coupon':
        return (
          <div className="pb-24">
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 text-white rounded-b-[2rem] shadow-lg mb-6">
              <h2 className="text-2xl font-bold mb-2">クーポン</h2>
              <p className="text-white/90 text-sm">現在地周辺のお得な情報が見つかります</p>

              {/* Beacon Simulator Button */}
              <button
                onClick={triggerBeaconDemo}
                className="mt-4 w-full bg-white/20 backdrop-blur-md hover:bg-white/30 border border-white/40 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Bell size={18} className="animate-bounce" />
                ビーコン検知デモを実行
              </button>
            </div>

            <div className="px-4 space-y-4">
              <div className="flex justify-between items-end px-2">
                <h3 className="font-bold text-gray-800">配布中のクーポン</h3>
                <span className="text-xs text-gray-500">{COUPONS.length}件</span>
              </div>

              {COUPONS.map(coupon => (
                <div key={coupon.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center relative overflow-hidden">
                  <div className="w-16 h-16 bg-gray-50 rounded-lg flex items-center justify-center text-3xl flex-shrink-0">
                    {coupon.image}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded mb-1 inline-block">{coupon.category}</span>
                      <span className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10} /> {coupon.location}</span>
                    </div>
                    <h4 className="font-bold text-gray-800">{coupon.name}</h4>
                    <p className="text-sm text-gray-500 mt-1">{coupon.description}</p>
                  </div>
                  <div className="flex flex-col items-end justify-center pl-2 border-l border-dashed border-gray-200 min-w-[80px]">
                    <span className="text-orange-500 font-bold text-lg">{coupon.discount}</span>
                    <button className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full mt-2 hover:bg-gray-700 transition">利用する</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'plans':
        return (
          <div className="pb-24">
            <div className="p-6 bg-white sticky top-0 z-10 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">おすすめプラン</h2>
              <p className="text-gray-500 text-sm">空き時間に合わせた最適な過ごし方</p>
            </div>

            <div className="p-4 space-y-6">
              {PLANS.map((plan) => (
                <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className={`p-4 ${plan.color} flex justify-between items-center`}>
                    <h3 className="font-bold text-lg">{plan.title}</h3>
                    <div className="bg-white/50 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold">
                      {plan.duration}
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="relative border-l-2 border-gray-200 ml-3 my-2 space-y-6">
                      {plan.steps.map((step, idx) => (
                        <div key={idx} className="relative pl-6">
                          <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-white border-4 border-blue-400"></div>
                          <span className="text-xs font-bold text-gray-400 block mb-1">{step.time}</span>
                          <p className="text-sm font-medium text-gray-800">{step.label}</p>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 border border-gray-300 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50 transition">
                      このプランで案内開始
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-md mx-auto h-[100dvh] bg-gray-50 flex flex-col relative font-sans text-gray-900 overflow-hidden">
      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {renderContent()}
      </div>

      {/* Bottom Navigation */}
      <div className="bg-white border-t border-gray-200 pt-2 px-6 pb-[env(safe-area-inset-bottom,16px)] flex justify-between items-center shadow-[0_-5px_20px_rgba(0,0,0,0.05)] z-40">
        {[
          { id: 'home', icon: <Home size={24} />, label: 'ホーム' },
          { id: 'map', icon: <Map size={24} />, label: 'マップ' },
          { id: 'coupon', icon: <Ticket size={24} />, label: 'クーポン' },
          { id: 'plans', icon: <Compass size={24} />, label: 'プラン' },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center p-2 transition-all duration-300 ${activeTab === item.id
              ? 'text-blue-600 -translate-y-1'
              : 'text-gray-400 hover:text-gray-600'
              }`}
          >
            {item.icon}
            <span className="text-[10px] font-bold mt-1">{item.label}</span>
            {activeTab === item.id && (
              <div className="w-1 h-1 bg-blue-600 rounded-full mt-1"></div>
            )}
          </button>
        ))}
      </div>

      {/* Beacon Popup Modal */}
      {showBeaconDemo && (
        <BeaconPopup
          coupon={COUPONS[0]}
          onClose={() => setShowBeaconDemo(false)}
        />
      )}
    </div>
  );
}