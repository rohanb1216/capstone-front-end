import React, { useState, useCallback, useContext } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, ImageBackground, Image } from "react-native";

import DocumentPicker from "react-native-document-picker/index";

import NativeUploady, {
  UploadyContext,
  useItemFinishListener,
  useItemStartListener,
  useItemErrorListener,
} from "@rpldy/native-uploady";

const Upload = () => {
  const [uploadUrl, setUploadUrl] = useState(false);
  const uploadyContext = useContext(UploadyContext);

  useItemFinishListener((item) => {
    const response = JSON.parse(item.uploadResponse.data);
    console.log(`item ${item.id} finished uploading, response was: `, response);
    setUploadUrl(response.url);
  });

  useItemErrorListener((item) => {
    console.log(`item ${item.id} upload error !!!! `, item);
  });

  useItemStartListener((item) => {
    console.log(`item ${item.id} starting to upload,name = ${item.file.name}`);
  });

  const pickFile = useCallback(async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      uploadyContext.upload(res);
      
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log("User cancelled the picker, exit any dialogs or menus and move on");
      } else {
        throw err;
      }
    }
  }, [uploadyContext]);

  return (
    <View>
      <Button title="Choose File" onPress={pickFile} />
      {uploadUrl && <Image source={{ uri: uploadUrl }} style={styles.uploadedImage} />}
    </View>
  );
};


const App = () => {
  return (
    <>
      <NativeUploady        
        destination={{ url: "https://my-server.test.com/upload" }}>
       
        <SafeAreaView>
          <ScrollView contentInsetAdjustmentBehavior="automatic">

            <View style={styles.body}>
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Upload File</Text>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>

        <Upload/>
      </NativeUploady>
    </>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
