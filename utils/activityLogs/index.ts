import { IActivityLogs } from '../../interface/activityLogs.interface';
import ActivityLogs from '../../model/ActivityLogs';

const recordActivityLogs: any = async (data: IActivityLogs) => {
    await ActivityLogs.create(data);
};

export default recordActivityLogs;
