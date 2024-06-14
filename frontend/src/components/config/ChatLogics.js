export const isSameSenderMargin = (messages, m, i, userId) => {
  if (!m || !m.sender) {
    return 0; // Return a default value or handle the case where sender is undefined
  }

  if (
    i < messages.length - 1 &&
    messages[i + 1] &&
    messages[i + 1].sender &&
    messages[i + 1].sender._id === m.sender._id &&
    m.sender._id !== userId
  ) {
    return 33;
  } else if (
    (i < messages.length - 1 &&
      messages[i + 1] &&
      messages[i + 1].sender &&
      messages[i + 1].sender._id !== m.sender._id &&
      m.sender._id !== userId) ||
    (i === messages.length - 1 && m.sender._id !== userId)
  ) {
    return 0;
  } else {
    return "auto";
  }
};

export const isSameSender = (messages, m, i, userId) => {
  if (!m || !m.sender || !messages[i + 1] || !messages[i + 1].sender) {
    return false; // Return false if any necessary data is missing
  }

  return (
    i < messages.length - 1 &&
    (messages[i + 1].sender._id !== m.sender._id ||
      messages[i + 1].sender._id === undefined) &&
    m.sender._id !== userId
  );
};

export const isLastMessage = (messages, i, userId) => {
  if (!messages[i] || !messages[i].sender) {
    return false; // Return false if message or sender is undefined
  }

  return (
    i === messages.length - 1 &&
    messages[messages.length - 1].sender &&
    messages[messages.length - 1].sender._id !== userId 
  );
};

export const isSameUser = (messages, m, i) => {
  if (!m || !m.sender || !messages[i - 1] || !messages[i - 1].sender) {
    return false; // Return false if any necessary data is missing
  }

  return (
    i > 0 &&
    messages[i - 1].sender._id === m.sender._id
  );
};

export const getSender = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) {
    return ""; // Return an empty string or handle the case where data is missing
  }

  return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
};

export const getSenderFull = (loggedUser, users) => {
  if (!loggedUser || !users || users.length < 2) {
    return {}; // Return an empty object or handle the case where data is missing
  }

  return users[0]._id === loggedUser._id ? users[1] : users[0];
};
