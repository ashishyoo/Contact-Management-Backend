interface ContactInput {
  name: string;
  email: string;
  phone: string;
}

interface UserInput {
  username: string;
  email: string;
  password: string;
}

export const validateContact = ({ name, email, phone }: ContactInput): void => {
  if (!name || !email || !phone) {
    throw new Error("All fields (name, email, phone) are required");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(phone)) {
    throw new Error("Phone number must be 10 digits");
  }
};

export const validateUser = ({
  username,
  email,
  password,
}: UserInput): void => {
  if (!username || !email || !password) {
    throw new Error("All fields (username, email, password) are required");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters");
  }
  if (username.length < 3) {
    throw new Error("Username must be at least 3 characters");
  }
};
