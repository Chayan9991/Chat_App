import {
  Box,
  Button,
  Input,
  Container,
  VStack,
  HStack,
} from "@chakra-ui/react";
import Message from "./Components/Message";
import {
  signOut,
  onAuthStateChanged,
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  
} from "firebase/auth";
import { app } from "./firebase";
import {query, orderBy, onSnapshot, getFirestore, addDoc, collection, serverTimestamp} from "firebase/firestore"; 
import { useEffect, useRef, useState } from "react";
import { async } from "@firebase/util";
const auth = getAuth(app);
const db = getFirestore(app); 


const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logOutHandler = () => {
  signOut(auth);
};



function App() {
 
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState(""); 
  const [messages, setMessages] = useState([]); 


  const divForScroll = useRef(null); 

  const submitHandler =async(e)=>{
    e.preventDefault(); 
    try{
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text : message, 
        uid : user.uid,
        uri: user.photoURL, 
        createdAt: serverTimestamp(),
      }); 

      
      divForScroll.current.scrollIntoView({behavior:"smooth"}) ; 

    }catch(err){
      alert(err); 
    }
  }; 

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"))
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });


  const unsubscribeForMessage =   onSnapshot(q,(snap)=>{
    
     setMessages(snap.docs.map(item=>{
      const id = item.id; 
      return {id,...item.data()}; 
    }) ) 
    
    })

    return () => {
      unsubscribe();
      unsubscribeForMessage(); 
    };
  }, []);

  return (
    <Box bg={"red.50"}>
      {/* now check whether user logged in or not */}
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack h="full" padding="4">
            <Button onClick={logOutHandler} w={"full"} colorScheme="red">
              Logout
            </Button>

            <VStack h="full" w="full" overflowY={"auto"} css={{"&:: -webkit-scrollbar": {
              display: "none"
            }}}>
              {
                messages.map((item)=>{
                 return  <Message key={item.id} user={item.uid===user.uid?"me":"other"} text ={item.text} uri={item.uri}/>
                })
              }
              <div ref= {divForScroll}></div>
            </VStack>
            
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input value={message} onChange={(e)=>{setMessage(e.target.value)}} placeholder="Enter a Message..." />
                <Button colorScheme="purple" type="submit">
                  send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack alignItems={"center"} bg={"white"} justifyContent={"center"}>
          <Button onClick={loginHandler} colorScheme={"purple"}>
            Sign in With Google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
