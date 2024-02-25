import { sidebarLinks } from "@/constants";
import { useUserContext } from "@/context/AuthContext";
import { useSignOutAccountMutation } from "@/lib/react-query/queriesAndMutations";
import { INavLink } from "@/types";
import { useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

const LeftSidebar = () => {
  // get the active link
  const { pathname } = useLocation();
  // context api
  const { user } = useUserContext();
  //console.log(user);
  const { mutate: signOut, isSuccess } = useSignOutAccountMutation();
  const navigate = useNavigate();
  useEffect(() => {
    if (isSuccess) navigate(0);
  }, [isSuccess]);

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-3">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/logo.svg"
            alt="logo"
            height={36}
            width={170}
          />
        </Link>
        <Link to={`/profile/${user.id}`} className="flex gap-3 items-center">
          <img
            src={user.imageUrl || "assets/images/profile-placeholder.svg"}
            alt="profileImg"
            className="h-14 w-14 rounded-full"
          />
          <div className="flex flex-col">
            <p className="body-bold">{user.name}</p>
            <p className="small-regular text-light-3">@{user.username}</p>
          </div>
        </Link>
        <ul className="flex flex-col gap-6">
          {/* Link tag  */}
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;
            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${
                  isActive && "bg-primary-500"
                }`}>
                <NavLink
                  to={link.route}
                  className={"flex items-center gap-4 p-4"}>
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${
                      isActive && "invert-white"
                    }`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
      <Button
        onClick={() => signOut()}
        variant={"ghost"}
        className="shed-button_ghost">
        <img src="/assets/icons/logout.svg" alt="logout" />
        <p className="small-medium lg:base-medium p-2">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;
