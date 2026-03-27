const showToast = (msg) => {
  const toast = document.createElement("div");
  toast.className =
    "fixed top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 px-8 py-3 rounded-full font-black shadow-2xl z-[5000] animate-bounce text-xs";
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
};

export default showToast;
