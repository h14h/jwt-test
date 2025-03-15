import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, Input } from "@rneui/themed";
import { createClient, type Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { Alert, AppState, StyleSheet, Text, View } from "react-native";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? "";

const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

export default function App() {
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log("Setting session:", JSON.stringify(session, null, 2));
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Setting session:", JSON.stringify(session, null, 2));
      setSession(session);
    });
  }, []);

  return (
    <View style={styles.wrapper}>
      {session?.user ? <HelloJWT /> : <Auth />}
    </View>
  );
}

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);

    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) Alert.alert(error.message);
    if (!session) Alert.alert("Please check your email inbox!");

    setLoading(false);
  }

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title="Sign in"
          disabled={loading}
          onPress={() => signInWithEmail()}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Button
          title="Sign up"
          disabled={loading}
          onPress={() => signUpWithEmail()}
        />
      </View>
    </View>
  );
}

function HelloJWT() {
  const [testResult, setTestResult] = useState("");

  async function signOut() {
    await supabase.auth.signOut();
  }

  async function triggerJwtTest() {
    setTestResult("Triggering JWT Test Function...");
    const { data, error } = await supabase.functions.invoke("hello-jwt");

    if (error) {
      console.info(error);
      setTestResult(JSON.stringify(error, null, 2));
    } else {
      console.info(data);
      setTestResult(JSON.stringify(data, null, 2));
    }
  }

  return (
    <View>
      <Button title="Trigger JWT" onPress={() => triggerJwtTest()} />
      <View style={styles.textWindow}>
        <ScrollView>
          <Text>{testResult}</Text>
        </ScrollView>
      </View>
      <Button title="Logout" onPress={() => signOut()} />
    </View>
  );
}

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

const styles = StyleSheet.create({
  textWindow: {
    height: 400,
    width: "90%",
    margin: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
  wrapper: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginTop: 40,
    padding: 12,
    width: "100%",
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
