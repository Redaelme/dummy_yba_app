import React, {FC} from "react";
import {Alert, Linking, Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const handleEmailPress = async () => {
    const url = 'mailto:yba@yba.ai';
    const canOpen = await Linking.canOpenURL(url);
    if (canOpen) {
        Linking.openURL(url);
    } else {
        Alert.alert('Error', 'Unable to open email client.');
    }
};
const ReAuthModal: FC<{ visible: boolean; onClose: () => void; handleReauth: () => void; t: (key: string) => string }> = ({ visible, onClose, handleReauth, t }) => (
        <Modal
            transparent={true}
            animationType="slide"
            visible={visible}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    {/*<Text style={styles.modalText}>*/}
                    {/*    {t('fields.Button.email.action.reconnect.modal.text')}*/}
                    {/*</Text>*/}

                    <TouchableOpacity style={styles.modalButton} onPress={handleReauth}>
                        <Text style={styles.modalButtonText}>{t('fields.Button.email.action.reconnect')}</Text>
                    </TouchableOpacity>

                    <Text style={styles.modalText}>
                        <Text style={{ fontWeight: 'bold' }}>{t('fields.Button.email.action.reconnect.modal.text1')}</Text> {t('fields.Button.email.action.reconnect.modal.text2')}

                        <TouchableOpacity
                            style={{
                                paddingVertical: 5,
                            }}
                            onPress={handleEmailPress}>
                            <Text style={{ color: 'blue' }}> yba@yba.ai</Text>
                        </TouchableOpacity>
                    </Text>
                </View>
            </View>
        </Modal>
    );


export default ReAuthModal;

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        // marginBottom: 20,
        fontSize: 16,
        textAlign: 'center',
    },
    modalButton: {
        padding: 10,
        backgroundColor: '#3C7548',
        borderRadius: 5,
        marginVertical: 10,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});