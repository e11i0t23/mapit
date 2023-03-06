import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { addDoc, collection, getDocs, getDoc, doc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../util/firebase";

export default function Header({ options, setOptions, markers, setMarkers }: mapit.mainProps) {
  const [showPage, setShowPage] = useState<string>("app");
  const [email, setEmail] = useState("");
  const [pwd, setPWD] = useState("");
  const [docs, setDocs] = useState<string[]>([]);

  const handeClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (showPage == "register")
      createUserWithEmailAndPassword(auth, email, pwd)
        .then((userCredential) => {
          const user = userCredential.user;
          setShowPage("app");
        })
        .catch((error) => {
          alert(error.message);
        });
    else
      signInWithEmailAndPassword(auth, email, pwd)
        .then((userCredential) => {
          const user = userCredential.user;
          setShowPage("app");
        })
        .catch((error) => {
          alert(error.message);
        });
  };
  useEffect(() => {
    if (auth.currentUser != null)
      getDocs(collection(db, `/user/${auth.currentUser?.uid}/maps`))
        .then((maps) => {
          var arr: string[] = [];
          maps.docs.forEach((doc) => arr.push(doc.id));
          return arr;
        })
        .then((arr) => setDocs(arr));
  }, [auth.currentUser]);

  const save = (e: React.MouseEvent) => {
    e.preventDefault();
    addDoc(collection(db, `/user/${auth.currentUser?.uid}/maps`), { options: options, markers: markers })
      .then((e) => console.log(e))
      .catch((e) => console.log(e.message));
  };

  const loadOptions = (id: string) => {
    if (auth.currentUser != null)
      getDoc(doc(db, "user", auth.currentUser.uid, "maps", id)).then((map) => {
        const data = map.data();
        if (data !== undefined) {
          setOptions(data.options);
          setMarkers(data.markers);
        }
      });
  };

  return (
    <>
      <nav className="navbar navbar-expand">
        <div className="container-fluid" style={{ zIndex: 1000 }}>
          <ul className="navbar-nav navbar-expand">
            {auth.currentUser !== null ? (
              <>
                <li className="nav-item me-3">
                  <a className="nav-link" href="" onClick={() => auth.signOut()}>
                    Logout
                  </a>
                </li>
                <li className="nav-item me-3">
                  <a className="nav-link" onClick={save}>
                    Save
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    {docs.map((x, i) => {
                      return (
                        <li key={i}>
                          <a className="dropdown-item" onClick={() => loadOptions(x)}>
                            {x}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item me-3">
                  <a className="nav-link" onClick={(e) => setShowPage("sign-in")}>
                    Sign-In
                  </a>
                </li>
                <li className="nav-item me-3">
                  <a className="nav-link" onClick={(e) => setShowPage("register")}>
                    Register
                  </a>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
      {showPage !== "app" && (
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            backgroundColor: "gray",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <h1>{showPage}</h1>
            <form onSubmit={handeClick}>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="password"
                className="form-control"
                id="password"
                value={pwd}
                onChange={(e) => setPWD(e.target.value)}
              />
              <input type="submit" className="form-control" />
            </form>
          </div>
        </div>
      )}
    </>
  );
}
