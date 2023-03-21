import { useState } from "react";
import MasquerText from "../components/MasquerText";
import { Member } from "../lib/models/user";
import {
  MdAddModerator,
  MdCancel,
  MdShield,
  MdCheckCircle,
} from "react-icons/md";
import { BsFillPersonPlusFill, BsFillTrashFill } from "react-icons/bs";
import { IoMdAddCircle } from "react-icons/io";
import { GoSignOut } from "react-icons/go";
import { FiEdit2 } from "react-icons/fi";

type Props = {
  roomName: string;
  members: Member[];
  membership: Member | undefined;
  onClose: () => void;
  onUpdateRoom: (roomName: string) => void;
  onDeleteRoom: () => void;
  onAddMember: (username: string, moderator: boolean) => void;
  onDeleteMember: (username: string) => void;
};

function RoomInfo(props: Props) {
  const {
    roomName,
    members,
    membership,
    onClose,
    onUpdateRoom,
    onDeleteRoom,
    onAddMember,
    onDeleteMember,
  } = props;

  const [isEditingRoom, setIsEditingRoom] = useState(false);
  const [editingRoomName, setEditingRoomName] = useState(roomName);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [memberUsername, setMemberUsername] = useState("");

  const handleUpdateRoom = () => {
    onUpdateRoom(editingRoomName);
    setIsEditingRoom(false);
  };

  const handleAddMember = (username: string, moderator: boolean) => {
    onAddMember(username, moderator);
    setIsAddingMember(false);
    setMemberUsername("");
  };

  return (
    <div className="absolute aspect-square rounded-br-full shadow-lg bg-red-500 animate-expandSettings">
      <div className="w-1/2 h-1/2 p-6 text-white overflow-scroll scrollbar-hidden">
        <div className="cursor-pointer mb-8" onClick={onClose}>
          <MasquerText
            text="<Back"
            flipIndices={[]}
            leftFontSize={27}
            fontStepSize={3}
            transform=""
            transformOrigin=""
            hoverInvert={true}
            transitionIn={false}
          />
        </div>
        <div className="mb-2">
          <MasquerText
            text="RooM"
            flipIndices={[]}
            leftFontSize={54}
            fontStepSize={4}
            transform="rotate(-12deg)"
            transformOrigin="left"
            hoverInvert={false}
            transitionIn={false}
          />
          <div className="relative left-12 -top-6 w-[calc(100%-3rem)] text-4xl flex justify-between items-center">
            {!isEditingRoom ? (
              <>
                {roomName}
                {membership?.moderator && (
                  <div className="flex gap-2">
                    <FiEdit2
                      size={24}
                      className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                      onClick={() => setIsEditingRoom(true)}
                    />
                    <BsFillTrashFill
                      size={24}
                      className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                      onClick={onDeleteRoom}
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Room Name"
                  className="w-4/5 text-lg px-2 py-1 rounded-sm text-neutral-900"
                  value={editingRoomName}
                  onChange={(e) => setEditingRoomName(e.target.value)}
                />
                <div className="flex gap-2">
                  <MdCheckCircle
                    size={24}
                    className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                    onClick={handleUpdateRoom}
                  />
                  <MdCancel
                    size={24}
                    className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                    onClick={() => setIsEditingRoom(false)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div className="mb-4 ml-auto w-max">
            <MasquerText
              text="MemberS"
              flipIndices={[2]}
              leftFontSize={46}
              fontStepSize={2}
              transform="rotate(12deg)"
              transformOrigin="left"
              hoverInvert={false}
              transitionIn={false}
            />
          </div>
          {members.map((user) => (
            <div
              key={user.username}
              className="flex justify-between items-center"
            >
              <div>
                <div className="text-2xl text-neutral-50 flex items-center gap-2">
                  {user.moderator && <MdShield />}
                  {user.name}
                </div>
                <div className="text-neutral-200">{user.username}</div>
              </div>
              {(membership?.moderator ||
                user.username === membership?.username) && (
                <div className="flex gap-2">
                  <GoSignOut
                    size={24}
                    className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                    onClick={() => onDeleteMember(user.username)}
                  />
                </div>
              )}
            </div>
          ))}
          {membership?.moderator && (
            <>
              {isAddingMember ? (
                <div className="flex items-center justify-between gap-2">
                  <input
                    type="text"
                    placeholder="username"
                    className="text-lg w-3/4 px-2 py-1 rounded-sm text-neutral-900"
                    value={memberUsername}
                    onChange={(e) => setMemberUsername(e.target.value)}
                  />
                  <div className="flex items-center gap-2">
                    <MdAddModerator
                      size={24}
                      className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                      onClick={() => handleAddMember(memberUsername, true)}
                    />
                    <BsFillPersonPlusFill
                      size={24}
                      className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                      onClick={() => handleAddMember(memberUsername, false)}
                    />
                    <MdCancel
                      size={24}
                      className="cursor-pointer text-neutral-900 hover:text-neutral-50"
                      onClick={() => setIsAddingMember(false)}
                    />
                  </div>
                </div>
              ) : (
                <IoMdAddCircle
                  size={48}
                  className="m-auto cursor-pointer text-neutral-900 hover:text-neutral-50"
                  onClick={() => setIsAddingMember(true)}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default RoomInfo;
