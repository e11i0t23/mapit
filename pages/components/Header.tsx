import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "@firebase/auth";
import { addDoc, collection, getDocs, getDoc, doc, updateDoc } from "@firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../../lib/firebase";
import { staticMapUrl } from "static-google-map";

export default function Header({
  options,
  setOptions,
  markers,
  setMarkers,
  menu,
  setMenu,
  staticURL,
  setStaticURL,
  optionsMemo,
}: mapit.mainProps) {
  const [showPage, setShowPage] = useState<string>("app");
  const [email, setEmail] = useState("");
  const [pwd, setPWD] = useState("");
  const [docs, setDocs] = useState<string[]>([]);
  const [id, setId] = useState<string | undefined>();

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
    if (auth.currentUser !== null) {
      if (id === undefined)
        addDoc(collection(db, `/user/${auth.currentUser.uid}/maps`), { options: options, markers: markers })
          .then((e) => setId(e.id))
          .catch((e) => console.log(e.message));
      else updateDoc(doc(db, "user", auth.currentUser.uid, "maps", id), { options: options, markers: markers });
    }
  };

  useEffect(() => {
    if (auth.currentUser !== null && id !== undefined)
      getDoc(doc(db, "user", auth.currentUser.uid, "maps", id)).then((map) => {
        const data = map.data();
        if (data !== undefined) {
          setOptions(data.options);
          setMarkers(data.markers);
        }
      });
  }, [id]);

  return (
    <>
      <nav className="navbar navbar-expand">
        <div className="container-fluid" style={{ zIndex: 1000 }}>
          <ul className="navbar-nav navbar-expand">
            <li className="nav-item me-3">
              <a className={`nav-link ${menu == "style" ? "active" : ""}`} onClick={() => setMenu("style")}>
                Styles
              </a>
            </li>
            <li className="nav-item me-3">
              <a className={`nav-link ${menu == "markers" ? "active" : ""}`} onClick={() => setMenu("markers")}>
                Markers
              </a>
            </li>
          </ul>
          <ul className="navbar-nav navbar-expand">
            <li className="nav-item me-3">
              <a className="nav-link" href={staticMapUrl(staticURL)} target="_blank" rel="noreferrer">
                Download
              </a>
            </li>
            {auth.currentUser !== null ? (
              <>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Load
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    {docs.map((x, i) => {
                      return (
                        <li key={i}>
                          <a className="dropdown-item" onClick={() => setId(x)}>
                            {x}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </li>
                <li className="nav-item me-3">
                  <a className="nav-link" onClick={save}>
                    Save
                  </a>
                </li>
                <li className="nav-item me-3">
                  <a className="nav-link" href="" onClick={() => auth.signOut()}>
                    Logout
                  </a>
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
          <button
            type="button"
            className="btn-close"
            style={{
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            onClick={(e) => {
              e.preventDefault();
              setShowPage("app");
            }}
            aria-label="Close"
          ></button>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
            <div>
              <form onSubmit={handeClick}>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email"
                />
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={pwd}
                  onChange={(e) => setPWD(e.target.value)}
                  placeholder="password"
                />
                <input type="submit" className="form-control" value={showPage} />
              </form>

              {showPage === "sign-in" && (
                <p>
                  Dont have an account?
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPage("register");
                    }}
                  >
                    Register here
                  </a>
                </p>
              )}
              {showPage === "register" && (
                <p>
                  Already have an account?
                  <a
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setShowPage("sign-in");
                    }}
                  >
                    Login here
                  </a>
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

{
  /* <div className="row">
<div className="btn-group" role="group">

<button
    className="btn btn-primary"
    onClick={(e) => {
      setMenu("style");
    }}
  >
    Style
  </button>
  <button
    className="btn btn-primary"
    onClick={(e) => {
      setMenu("markers");
    }}
  >
    Markers
  </button>
  
  {/* <button
    className="btn btn-primary"
    onClick={(e) => {
      setMenu("other");
    }}
  >
    Other
  </button> */
}
// </div>
// </div> */}
