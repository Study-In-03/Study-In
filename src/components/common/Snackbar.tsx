import { useSnackbarStore } from '@/store/snackbarStore';
import SnackbarImg from '@/assets/base/Snack-bar.svg';

const Snackbar = () => {
  const isVisible = useSnackbarStore((s) => s.isVisible);

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}
    >
      <img src={SnackbarImg} alt="신고가 접수되었어요." width={290} height={80} />
    </div>
  );
};

export default Snackbar;
