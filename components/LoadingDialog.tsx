import React from 'react';
import { Portal, Dialog, ActivityIndicator, Text } from 'react-native-paper';
import { View } from 'react-native';

interface LoadingDialogProps {
  open: boolean;
  message?: string;
}

export const LoadingDialog: React.FC<LoadingDialogProps> = ({ 
  open, 
  message = 'Loading...' 
}) => {
  return (
    <Portal>
      <Dialog
        visible={open}
        dismissable={false}
        style={{
          backgroundColor: 'transparent',
          elevation: 0,
        }}
      >
        <View
          style={{
            padding: 16,
            backgroundColor: 'white',
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <ActivityIndicator size="large" />
          {message && (
            <Text
              style={{
                marginTop: 16,
                color: 'rgba(0, 0, 0, 0.6)',
              }}
            >
              {message}
            </Text>
          )}
        </View>
      </Dialog>
    </Portal>
  );
};
