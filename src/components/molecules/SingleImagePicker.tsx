import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import CImage from "../atoms/CImage";
import { MediaPickerType, StyleArgs } from "../../utils/enum/enums";
import { Images } from "../../utils/imageSource/imageSource";

import ImageCropPicker, { Image } from "react-native-image-crop-picker";
import ActionSheet from "react-native-actionsheet";
import { useStyleArgs } from "../../utils/constants/constants";

interface SingleImagePickerProps {
  onChangeImage?: (image: Image) => void;
  editImage: any;
}
const SingleImagePicker = (props: SingleImagePickerProps) => {
  const styles = useStyleArgs(styleHandler);
  const actionSheet = useRef<ActionSheet>(null);

  // console.log(
  //   'hey imagepicker props----',
  //   props?.editImage?.profileData?.profileUrl,
  // );

  const [image, setImage] = useState<MediaPickerType | null>(null);
  const choosePhoto = async () => {
    try {
      const image1 = await ImageCropPicker?.openPicker({
        multiple: false,
        cropping: false,
        mediaType: "photo",
      });
      const image = await ImageCropPicker?.openCropper({
        path: image1.path,
        mediaType: "photo",
      });
      setImage({
        type: "image",
        source: {
          uri: image.path,
          mimeType: image.mime,
          name: image.filename,
          size: image.size,
        },
      });
      props.onChangeImage && props.onChangeImage(image);
    } catch (error) {
      console.log("🚀 ~ file: index.js:38 ~ choosePhoto ~ error:", error);
    }
  };
  const takePhoto = async () => {
    try {
      const image1 = await ImageCropPicker?.openCamera({
        multiple: false,
        cropping: false,
        mediaType: "photo",
      });
      const image = await ImageCropPicker?.openCropper({
        path: image1.path,
        mediaType: "photo",
      });
      setImage({
        type: "image",
        source: {
          uri: image.path,
          mimeType: image.mime,
          name: image.filename,
          size: image.size,
        },
      });
      props.onChangeImage && props.onChangeImage(image);
    } catch (error) {
      console.log("🚀 ~ file: index.js:47 ~ takePhoto ~ error:", error);
    }
  };

  const onPressAction = (index: number) => {
    switch (index) {
      case 0:
        takePhoto();
        break;
      case 1:
        choosePhoto();
        break;
      default:
        break;
    }
  };

  return (
    <Pressable
      style={styles.container}
      onPress={() => actionSheet.current?.show()}
    >
      <CImage
        source={
          image?.source?.uri
            ? { uri: image.source.uri }
            : props?.editImage?.fromEdit
            ? { uri: props?.editImage?.profileData?.profileUrl }
            : Images?.placeholder_person
        }
        style={styles.image}
      />
      <View style={styles.iconContainer}>
        <CImage source={Images?.camera} style={styles.icon} />
      </View>
      <ActionSheet
        ref={actionSheet}
        title="Insert Supporting Documents"
        options={["Take Photo", "Choose Photo", "Cancel"]}
        cancelButtonIndex={2}
        onPress={onPressAction}
      />
    </Pressable>
  );
};

export default SingleImagePicker;

const styleHandler = ({ dims, insets, theme: { colors } }: StyleArgs) =>
  StyleSheet.create({
    container: {
      height: dims.width * 0.22,
      width: dims.width * 0.22,
      alignSelf: "center",
    },
    image: {
      height: dims.width * 0.22,
      width: dims.width * 0.22,
      borderRadius: dims.width * 0.22,
    },
    icon: {
      height: dims.width * 0.05,
      width: dims.width * 0.05,
    },
    iconContainer: {
      padding: dims.width * 0.01,
      backgroundColor: colors.primary,
      borderRadius: 100,
      position: "absolute",
      bottom: 0,
      right: 0,
    },
  });
