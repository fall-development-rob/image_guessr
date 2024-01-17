import Image from "next/image";
import Link from "next/link";

type TopBarProps = {
  gameId: string | null;
};

const TopBar: React.FC<TopBarProps> = (props: TopBarProps) => {
  const { gameId } = props;

  return (
    <div className="flex flex-col w-full px-6">
      <div className="flex w-full h-24 justify-center">
        <div className="flex flex-1">
          {gameId && (
            <div className="mr-auto my-auto text-sm text-gray-400">
              Game ID: {gameId}
            </div>
          )}
        </div>
        <div className="flex flex-auto">
          <Link
            className="m-auto pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="/"
          >
            <div className="mt-auto text-sm hidden sm:block">GenGuessr By</div>
            <div className="relative w-24 h-6">
              <Image src="/logo.svg" alt="Gendo Logo" fill priority />
            </div>
          </Link>
        </div>
        <div className="flex flex-1">
          {gameId && (
            <Link
              className="ml-auto my-auto"
              href={"http://localhost:8000/game/new"}
            >
              <button className="border border-white border-opacity-50 h-fit py-2 px-6 text-sm rounded hover:bg-white hover:bg-opacity-90 hover:text-black">
                <span className="inline-block text-xl">&#43;</span> New Game
              </button>
            </Link>
          )}
        </div>
      </div>
      <hr className="mx-auto w-full white opacity-20" />
    </div>
  );
};

export default TopBar;