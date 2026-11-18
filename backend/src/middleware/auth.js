import jwt from "jsonwebtoken";
export function authenticate(req,res,next) {
  const header=req.headers.authorization || "";
  const token=header.startsWith("Bearer ")?header.slice(7):null;
  if(!token) return res.status(401).json({message:"Please sign in to continue."});
  try {
    req.user=jwt.verify(token,process.env.JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({message:"Your session is invalid or has expired. Please sign in again."});
  }
}
export function allowRoles(...roles) {
  return (req,res,next)=>roles.includes(req.user?.role)?next():res.status(403).json({message:"You do not have permission to perform this action."});
}
