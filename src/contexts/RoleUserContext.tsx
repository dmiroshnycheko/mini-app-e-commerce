import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type RoleUserContextType = {
  role: string;
  setRole: (role: string) => void;
  bonusPercent: number;
  setBonusPercent: (percent: number) => void;
};

const RoleUserContext = createContext<RoleUserContextType | undefined>(
  undefined
);

export const RoleUserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [role, setRole] = useState<string>("");
  const [bonusPercent, setBonusPercent] = useState(0);

  return (
    <RoleUserContext.Provider
      value={{ role, setRole, setBonusPercent, bonusPercent }}
    >
      {children}
    </RoleUserContext.Provider>
  );
};

export const useRoleUser = (): RoleUserContextType => {
  const context = useContext(RoleUserContext);
  if (!context) {
    throw new Error("useRoleUser must be used within a RoleUserProvider");
  }
  return context;
};
