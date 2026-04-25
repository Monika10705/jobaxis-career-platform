//validation functions
export const validateEmail = (email) => {
  if (!email.trim()) return "Email id Required";
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^s@]+$/;
  if (!emailRegex.test(email)) return "Please enter a valid email address.";
  return "";
};

export const validatePassword = (password) => {
    if(!password) return "Password is required."
    if(password.length < 8) return "Password must be atleast 8 characters."
    if(!/(?=.*[a-z])/.test(password))
        return "Password must contain atleast one lowercase letter";
    if(!/(?=.*[A-Z])/.test(password))
        return "Password must contain atleast one Uppercase letter";
    if(!/(?=.*\d)/.test(password))
        return "Password must contain atleast one number.";
    return "";
}

export const validateAvatar = (file) => {
    if (!file) return ""; //Avatar is optional
    
    const allowedTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    if(!allowedTypes.includes(file.type)) {
        return "Avatar must be a JPG or PNG file";
    }

    const maxSize = 5*1024*1024; //5mb
    if(file.size>maxSize){
        return "Avatar must be less than 5MB";
    }

    return "";
}

export const getInitials = (name) => {
  if (!name || typeof name !== "string") return "NA";

  return name
    .trim()
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
