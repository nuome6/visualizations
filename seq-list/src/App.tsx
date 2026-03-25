import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PlusCircle, Trash2, Search, ArrowRightToLine, RotateCcw } from 'lucide-react';

type Item = {
  id: number;
  value: number;
};

const CAPACITY = 10;
const ANIMATION_SPEED = 800;

export default function App() {
  const [list, setList] = useState<(Item | null)[]>(() => {
    const initial = Array(CAPACITY).fill(null);
    initial[0] = { id: 1, value: 12 };
    initial[1] = { id: 2, value: 24 };
    initial[2] = { id: 3, value: 36 };
    return initial;
  });
  const [length, setLength] = useState(3);
  const [nextId, setNextId] = useState(4);

  const [message, setMessage] = useState("欢迎使用顺序表可视化教学！请在下方选择操作。");
  const [isAnimating, setIsAnimating] = useState(false);
  
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);
  const [successIndex, setSuccessIndex] = useState<number | null>(null);

  const [insertPosition, setInsertPosition] = useState('');
  const [insertValue, setInsertValue] = useState('');
  const [deleteValue, setDeleteValue] = useState('');
  const [searchPosition, setSearchPosition] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const handleReset = () => {
    const initial = Array(CAPACITY).fill(null);
    initial[0] = { id: 1, value: 12 };
    initial[1] = { id: 2, value: 24 };
    initial[2] = { id: 3, value: 36 };
    setList(initial);
    setLength(3);
    setNextId(4);
    setMessage("已重置顺序表。");
    setHighlightIndex(null);
    setSuccessIndex(null);
    setInsertPosition('');
    setInsertValue('');
    setDeleteValue('');
    setSearchPosition('');
    setSearchValue('');
  };

  const handleInsert = async (positionStr: string, valueStr: string) => {
    const position = parseInt(positionStr, 10);
    const value = parseInt(valueStr, 10);

    if (isNaN(position) || isNaN(value)) {
      setMessage("请输入有效的数字！");
      return;
    }
    if (length >= CAPACITY) {
      setMessage("顺序表已满，无法插入！");
      return;
    }
    if (position < 1 || position > length + 1) {
      setMessage(`插入位序不合法！有效范围是 1 到 ${length + 1}`);
      return;
    }

    const index = position - 1;

    setIsAnimating(true);
    setMessage(`准备在位序 ${position} (下标 ${index}) 插入元素 ${value}`);
    await sleep(ANIMATION_SPEED);

    let currentList = [...list];

    // Shift elements right one by one
    for (let i = length - 1; i >= index; i--) {
      setHighlightIndex(i);
      setMessage(`将位序 ${i + 1} (下标 ${i}) 的元素 ${currentList[i]?.value} 后移到位序 ${i + 2}`);
      currentList[i + 1] = currentList[i];
      currentList[i] = null;
      setList([...currentList]);
      await sleep(ANIMATION_SPEED);
    }

    setHighlightIndex(index);
    setMessage(`在位序 ${position} (下标 ${index}) 插入新元素 ${value}`);
    currentList[index] = { id: nextId, value };
    setNextId(nextId + 1);
    setLength(length + 1);
    setList([...currentList]);
    setSuccessIndex(index);
    await sleep(ANIMATION_SPEED);

    setMessage(`插入完成！`);
    setHighlightIndex(null);
    setSuccessIndex(null);
    setInsertPosition('');
    setInsertValue('');
    setIsAnimating(false);
  };

  const handleDeleteByValue = async (valueStr: string) => {
    const value = parseInt(valueStr, 10);
    if (isNaN(value)) {
      setMessage("请输入有效的数字！");
      return;
    }
    if (length === 0) {
      setMessage("顺序表为空，无法删除！");
      return;
    }

    setIsAnimating(true);
    setMessage(`准备删除值为 ${value} 的元素`);
    await sleep(ANIMATION_SPEED);

    let currentList = [...list];
    let foundIdx = -1;

    // Search
    for (let i = 0; i < length; i++) {
      setHighlightIndex(i);
      setMessage(`检查位序 ${i + 1} (下标 ${i}) 的元素是否为 ${value}`);
      await sleep(ANIMATION_SPEED);
      if (currentList[i]?.value === value) {
        foundIdx = i;
        setSuccessIndex(i);
        setMessage(`在位序 ${i + 1} (下标 ${i}) 找到元素 ${value}，准备删除`);
        await sleep(ANIMATION_SPEED);
        break;
      }
    }

    if (foundIdx === -1) {
      setMessage(`未找到值为 ${value} 的元素，删除失败`);
      setHighlightIndex(null);
      setIsAnimating(false);
      return;
    }

    // Delete
    currentList[foundIdx] = null;
    setList([...currentList]);
    setSuccessIndex(null);
    setHighlightIndex(foundIdx);
    setMessage(`已删除位序 ${foundIdx + 1} (下标 ${foundIdx}) 的元素`);
    await sleep(ANIMATION_SPEED);

    // Shift left
    for (let i = foundIdx + 1; i < length; i++) {
      setHighlightIndex(i);
      setMessage(`将位序 ${i + 1} (下标 ${i}) 的元素 ${currentList[i]?.value} 前移到位序 ${i}`);
      currentList[i - 1] = currentList[i];
      currentList[i] = null;
      setList([...currentList]);
      await sleep(ANIMATION_SPEED);
    }

    setLength(length - 1);
    setMessage(`删除完成！`);
    setHighlightIndex(null);
    setDeleteValue('');
    setIsAnimating(false);
  };

  const handleSearchByPosition = async (positionStr: string) => {
    const position = parseInt(positionStr, 10);
    if (isNaN(position)) {
      setMessage("请输入有效的数字！");
      return;
    }
    if (position < 1 || position > length) {
      setMessage(`查找位序不合法！有效范围是 1 到 ${length}`);
      return;
    }

    const index = position - 1;

    setIsAnimating(true);
    setMessage(`准备查找位序 ${position} (下标 ${index}) 的元素`);
    await sleep(ANIMATION_SPEED);

    setHighlightIndex(index);
    setSuccessIndex(index);
    setMessage(`位序 ${position} (下标 ${index}) 的元素是 ${list[index]?.value}`);
    await sleep(ANIMATION_SPEED * 2);

    setHighlightIndex(null);
    setSuccessIndex(null);
    setMessage("查找完成！");
    setSearchPosition('');
    setIsAnimating(false);
  };

  const handleSearchByValue = async (valueStr: string) => {
    const value = parseInt(valueStr, 10);
    if (isNaN(value)) {
      setMessage("请输入有效的数字！");
      return;
    }
    
    setIsAnimating(true);
    setMessage(`准备查找值为 ${value} 的元素`);
    await sleep(ANIMATION_SPEED);

    for (let i = 0; i < length; i++) {
      setHighlightIndex(i);
      setMessage(`检查位序 ${i + 1} (下标 ${i}) 的元素是否为 ${value}`);
      await sleep(ANIMATION_SPEED);
      
      if (list[i]?.value === value) {
        setSuccessIndex(i);
        setMessage(`查找成功！在位序 ${i + 1} (下标 ${i}) 找到元素 ${value}`);
        await sleep(ANIMATION_SPEED * 2);
        setHighlightIndex(null);
        setSuccessIndex(null);
        setSearchValue('');
        setIsAnimating(false);
        return;
      }
    }

    setMessage(`查找失败！未找到值为 ${value} 的元素`);
    setHighlightIndex(null);
    setIsAnimating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 md:p-8 flex flex-col items-center">
      <div className="max-w-5xl w-full">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-slate-800">顺序表 (Sequential List) 可视化</h1>
          <button 
            onClick={handleReset}
            disabled={isAnimating}
            className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50"
          >
            <RotateCcw size={18} />
            重置状态
          </button>
        </div>

        {/* Message Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 mb-8 flex items-center justify-center min-h-[100px]">
          <p className="text-xl md:text-2xl font-medium text-indigo-600 text-center transition-all">
            {message}
          </p>
        </div>

        {/* Array Visualization */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8 overflow-x-auto">
          <div className="flex gap-3 justify-center min-w-max pb-4">
            {list.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                {/* Position and Index labels */}
                <span className="text-xs font-bold text-indigo-600 mb-1">位序 {index + 1}</span>
                <span className="text-xs font-mono text-slate-400 mb-2">下标 [{index}]</span>
                
                {/* Slot */}
                <div className={`
                  w-16 h-16 rounded-xl border-2 relative flex items-center justify-center transition-colors duration-300
                  ${highlightIndex === index ? 'border-indigo-400 bg-indigo-50' : 'border-slate-200 bg-slate-50'}
                  ${successIndex === index ? 'border-emerald-400 bg-emerald-50' : ''}
                `}>
                  <AnimatePresence>
                    {item && (
                      <motion.div
                        layoutId={`item-${item.id}`}
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        className={`
                          absolute inset-1 rounded-lg shadow-sm flex items-center justify-center text-xl font-bold
                          ${successIndex === index ? 'bg-emerald-500 text-white' : 'bg-indigo-500 text-white'}
                        `}
                      >
                        {item.value}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-6 text-slate-500 text-sm">
            当前长度: <span className="font-bold text-slate-700">{length}</span> / 容量: <span className="font-bold text-slate-700">{CAPACITY}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Insert */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <PlusCircle size={18} />
              </span>
              按位插入
            </h3>
            <div className="flex gap-3">
              <input 
                type="number" 
                placeholder="位序 i" 
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[80px]"
                value={insertPosition}
                onChange={e => setInsertPosition(e.target.value)}
                disabled={isAnimating}
              />
              <input 
                type="number" 
                placeholder="元素 x" 
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-w-[80px]"
                value={insertValue}
                onChange={e => setInsertValue(e.target.value)}
                disabled={isAnimating}
              />
              <button 
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                onClick={() => handleInsert(insertPosition, insertValue)}
                disabled={isAnimating || insertPosition === '' || insertValue === ''}
              >
                插入
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">在指定位序 (1~n+1) 插入元素，其后的元素将依次后移。</p>
          </div>

          {/* Delete */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-rose-100 text-rose-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <Trash2 size={18} />
              </span>
              按值删除
            </h3>
            <div className="flex gap-3">
              <input 
                type="number" 
                placeholder="元素 x" 
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent min-w-[80px]"
                value={deleteValue}
                onChange={e => setDeleteValue(e.target.value)}
                disabled={isAnimating}
              />
              <button 
                className="bg-rose-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                onClick={() => handleDeleteByValue(deleteValue)}
                disabled={isAnimating || deleteValue === ''}
              >
                删除
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">查找并删除第一个匹配的元素，其后的元素将依次前移。</p>
          </div>

          {/* Search by Index */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-emerald-100 text-emerald-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <ArrowRightToLine size={18} />
              </span>
              按位查找
            </h3>
            <div className="flex gap-3">
              <input 
                type="number" 
                placeholder="位序 i" 
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent min-w-[80px]"
                value={searchPosition}
                onChange={e => setSearchPosition(e.target.value)}
                disabled={isAnimating}
              />
              <button 
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                onClick={() => handleSearchByPosition(searchPosition)}
                disabled={isAnimating || searchPosition === ''}
              >
                查找
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">直接访问指定位序 (1~n) 的元素，底层通过下标访问 (O(1) 时间复杂度)。</p>
          </div>

          {/* Search by Value */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-600 w-8 h-8 rounded-lg flex items-center justify-center">
                <Search size={18} />
              </span>
              按值查找
            </h3>
            <div className="flex gap-3">
              <input 
                type="number" 
                placeholder="元素 x" 
                className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent min-w-[80px]"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                disabled={isAnimating}
              />
              <button 
                className="bg-amber-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                onClick={() => handleSearchByValue(searchValue)}
                disabled={isAnimating || searchValue === ''}
              >
                查找
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-3">从头开始遍历顺序表，寻找匹配的元素 (O(n) 时间复杂度)。</p>
          </div>
        </div>
      </div>
    </div>
  );
}
