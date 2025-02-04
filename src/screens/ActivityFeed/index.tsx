import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { SafeAreaView, StatusBar, Text, View, SectionList, SectionListData } from 'react-native';
import { NavigationComponentProps } from 'react-native-navigation';

import { useStateTree } from 'models';
import { signout } from 'services/auth';
import { AuthButton } from 'components/AuthButton';
import { Button } from 'components/Button';

import { ActivityFeedItem, ActivityFeedSection, useActivityFeed } from './hooks';
import s from './styles';

export interface ActivityFeedProps {}

export const ActivityFeed: FC<ActivityFeedProps & NavigationComponentProps> = observer(function ActivityFeed(_props) {
    const { user, activity, serviceStatus } = useStateTree();

    const { activities, ...controllers } = useActivityFeed(activity, serviceStatus);

    return (
        <SafeAreaView style={s.safeArea}>
            <View style={s.container}>
                <StatusBar barStyle={'light-content'} />
                <View style={s.header}>
                    <View style={s.headerTitle}>
                        <Text style={s.title}>Activity</Text>
                    </View>
                    <View style={s.headerControls}>
                        {controllers.isRunning ? (
                            <Button icon={'stop'} onPress={controllers.stop} />
                        ) : (
                            <Button icon={'play'} onPress={controllers.start} />
                        )}
                        <Button icon={'rotate-right'} onPress={controllers.reset} />
                    </View>
                </View>
                <SectionList
                    sections={activities}
                    keyExtractor={({ sample }) => sample.id}
                    renderSectionHeader={ActivityFeedSectionHeader}
                    renderItem={ActivityFeedSectionItem}
                    renderSectionFooter={ActivityFeedSectionFooter}
                    style={s.sectionList}
                    contentContainerStyle={s.sectionListContent}
                    showsVerticalScrollIndicator={false}
                />
                <View style={s.signInContainer}>
                    {user.patient !== undefined ? (
                        <>
                            <Button onPress={signout} label="Sign out" />
                            <Text style={s.footnote}>Signed in as: {user.name ?? 'N/A'}</Text>
                        </>
                    ) : (
                        <>
                            <AuthButton />
                            <Text style={s.footnote}>Unique identifier will be associated with your data</Text>
                        </>
                    )}
                </View>
            </View>
        </SafeAreaView>
    );
});

function ActivityFeedSectionHeader(props: { section: SectionListData<ActivityFeedItem, ActivityFeedSection> }) {
    return (
        <View style={s.sectionHeader}>
            <View style={s.sectionHeaderTitle}>
                <Text style={s.sectionHeaderTitleText}>{props.section.title}</Text>
            </View>
        </View>
    );
}

function ActivityFeedSectionFooter(props: { section: SectionListData<ActivityFeedItem, ActivityFeedSection> }) {
    return (
        <View style={s.sectionFooter}>
            <Text style={s.footnote}>{props.section.summary}</Text>
        </View>
    );
}

function ActivityFeedSectionItem({ item: activity }: { item: ActivityFeedItem }) {
    return (
        <View style={s.sectionItem}>
            <View style={s.sectionItemActivity}>
                <Text style={s.sectionItemActivityLabelText}>{activity.sample.display}</Text>
                {activity.sample.activeEnergyBurned !== undefined ? (
                    <Text style={s.sectionItemActivityDetailsText}>
                        {Math.round(activity.sample.activeEnergyBurned)} kcal
                    </Text>
                ) : undefined}
            </View>
            <Text style={s.sectionItemActivityDetailsText}>{activity.duration}</Text>
        </View>
    );
}
