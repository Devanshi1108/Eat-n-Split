import { use, useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

export default function App() {
  return <SplitNEat />;
}

function SplitNEat() {
  const [addFriend, setAddFriend] = useState(false);
  const [friendsData, setFriendsData] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);
  function handleAddFriendBtn() {
    setAddFriend((show) => !show);
  }
  function handleSelectedFriend(friend) {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setAddFriend(false);
  }

  function handleSplitBill(value) {
    setFriendsData((friends) =>
      friends.map((el) =>
        el.id === selectedFriend.id
          ? { ...el, balance: el.balance + value }
          : el
      )
    );
    setSelectedFriend(null);
  }
  return (
    <div className="app">
      <div className="sidebar">
        <FriendsList
          friendsData={friendsData}
          handleSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
        {addFriend ? (
          <AddFriend
            setFriendsData={setFriendsData}
            handleAddFriendBtn={handleAddFriendBtn}
          />
        ) : (
          ""
        )}

        <Button onAddClick={handleAddFriendBtn}>
          {addFriend ? "Close" : "Add Freind"}
        </Button>
      </div>
      {selectedFriend ? (
        <SplitForm
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          handleSplitBill={handleSplitBill}
        />
      ) : (
        ""
      )}
    </div>
  );
}
function Button({ onAddClick, children }) {
  return (
    <button className="button" onClick={onAddClick}>
      {children}
    </button>
  );
}

function FriendsList({ friendsData, handleSelectedFriend, selectedFriend }) {
  return (
    <ul>
      {friendsData.map((el) => (
        <Friend
          friend={el}
          key={el.id}
          handleSelectedFriend={handleSelectedFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}
function Friend({ friend, handleSelectedFriend, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance > 0 ? (
        <p className="red">
          You owe {friend.name} {friend.balance}€
        </p>
      ) : (
        ""
      )}
      {friend.balance < 0 ? (
        <p className="green">
          {friend.name} owes you {Math.abs(friend.balance)}€
        </p>
      ) : (
        ""
      )}
      {friend.balance === 0 ? <p>You and {friend.name} are even.</p> : ""}

      <Button onAddClick={() => handleSelectedFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
function AddFriend({ setFriendsData, handleAddFriendBtn }) {
  const [friendName, setFriendName] = useState("");
  const [friendImage, setFriendImage] = useState("https://i.pravatar.cc/48");

  function handleAddFriend(e) {
    e.preventDefault();
    if (!friendName || !friendImage) return;
    const id = crypto.randomUUID();
    const newFriendObj = {
      id,
      name: friendName,
      image: `${friendImage}?=${id}`,
      balance: 0,
    };
    //Add new obj to array
    setFriendsData((arr) => [...arr, newFriendObj]);
    //Close the form
    handleAddFriendBtn();

    //set to default
    setFriendImage("https://i.pravatar.cc/48");
    setFriendName("");
  }
  return (
    <form className="form-add-friend" onSubmit={handleAddFriend}>
      <label>👫 Friend name</label>
      <input
        type="text"
        value={friendName}
        onChange={(e) => setFriendName(e.target.value)}
      />
      <label>🌄 Image URL</label>
      <input
        type="text"
        value={friendImage}
        onChange={(e) => setFriendImage(e.target.value)}
      />
      <Button>Add</Button>
    </form>
  );
}

function SplitForm({ selectedFriend, handleSplitBill }) {
  const [billAmount, setBillAmount] = useState(0);
  const [myExpense, setMyExpense] = useState(0);
  const [paidBy, setPaidBy] = useState("user");
  const friendsExpense = billAmount ? billAmount - myExpense : "";

  function handleSplitForm(e) {
    e.preventDefault();
    if (!billAmount || !myExpense) return;
    handleSplitBill(paidBy === "user" ? -myExpense : friendsExpense);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplitForm}>
      <h2>Split a bill with {selectedFriend.name}</h2>
      <lable>💰 Bill value</lable>
      <input
        type="text"
        value={billAmount}
        onChange={(e) => setBillAmount(Number(e.target.value))}
      ></input>
      <label>🧍‍♀️ Your expense</label>
      <input
        type="text"
        value={myExpense}
        onChange={(e) =>
          setMyExpense(
            Number(e.target.value) > billAmount
              ? billAmount
              : Number(e.target.value)
          )
        }
      ></input>
      <label>👫 {selectedFriend.name}'s expense</label>
      <input type="text" disabled value={friendsExpense}></input>
      <label>🤑 Who is paying the bill</label>
      <select value={paidBy} onChange={(e) => setPaidBy(e.target.value)}>
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>
      <Button>Split Bill</Button>
    </form>
  );
}
