import { HttpException } from '@/exceptions/HttpException';
import { codes, message } from '@/utils/messages';
import inquiryModel from '@/models/inquiry.model';
import requirementModel from '@/models/requirement.model';
import sourceModel from '@/models/source.model';
import userModel from '@/models/users.model';
export class InquiryService {
  public Inquiry = inquiryModel;
  public Requirement = requirementModel;
  public Source = sourceModel;
  public User = userModel;

  public async listAllInquiries(query: any, skip?: any, limit?: any, sortOn?: any) {
    const allInquiries = await this.Inquiry.find(query)
      .skip(skip)
      .limit(limit)
      .select('-modifiedAt')
      .sort(sortOn || { createdAt: -1 })
      .lean();

    const count = await this.Inquiry.find(query).count();
    if (allInquiries) {
      return { allInquiries, count };
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToGetData
      );
    }
  }

  public async getInquiryData(data: any) {
    const inquiryData = await this.Inquiry.findOneAndUpdate(
      { _id: data.id },
      { isRead: 1 },
      { new: true, runValidators: true }
    );
    if (inquiryData) {
      return inquiryData;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToGetData
      );
    }
  }

  public async addNewinquiry(data: any) {
    if (data.source) {
      const getSource = await this.Source.findOne({ _id: data.source }).lean();
      data.source =
        data.source && getSource.sourceName ? getSource.sourceName : '';
      data.sourceId = data.source ? data.source : '';
    }

    const getUser = await this.User.findOne({ _id: data.person }).lean();
    data.personId = data.person ? data.person : '';
    data.person = data.person && getUser.full_name ? getUser.full_name : '';
    data.moreThanOneThousandUnits = false;
    const requirementArray = [];
    for (let i = 0; i < data.requirements.length; i++) {
      const findRequirement = await this.Requirement.findOne({
        _id: data.requirements[i].requirementId,
      });
      const requirementId = data.requirements[i].requirementId;
      const requirement = findRequirement.requirement;
      const units = data.requirements[i].units;
      requirementArray.push({ requirementId, requirement, units });
    }
    data.requirements.some((e) => e.units >= 1000)
      ? (data.moreThanOneThousandUnits = true)
      : (data.moreThanOneThousandUnits = false);
    data.requirements = requirementArray;
    const newInquiry = await this.Inquiry.create(data);
    if (newInquiry) {
      return newInquiry;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToCreate
      );
    }
  }

  public async updateInquiry(data: any) {
    if (data.source) {
      const getSource = await this.Source.findOne({ _id: data.source }).lean();
      data.sourceId = data.source ? data.source : '';
      data.source =
        data.source && getSource.sourceName ? getSource.sourceName : '';
    }
    if (data.person) {
      const getUser = await this.User.findOne({ _id: data.person }).lean();
      data.personId = data.person ? data.person : '';
      data.person = data.person && getUser.full_name ? getUser.full_name : '';
    }

    if (data.requirements) {
      const requirementArray = [];
      for (let i = 0; i < data.requirements.length; i++) {
        const findRequirement = await this.Requirement.findOne({
          _id: data.requirements[i].requirementId,
        });
        const requirementId = data.requirements[i].requirementId;
        const requirement = findRequirement.requirement;
        const units = data.requirements[i].units;
        requirementArray.push({ requirementId, requirement, units });
      }
      data.requirements = requirementArray;
      data.requirements.some((e) => e.units >= 1000)
        ? (data.moreThanOneThousandUnits = true)
        : (data.moreThanOneThousandUnits = false);
    }
    const updateInquiry = await this.Inquiry.findOneAndUpdate(
      { _id: data.id },
      data,
      { new: true, runValidators: true }
    );
    if (updateInquiry) {
      return updateInquiry;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToUpdate
      );
    }
  }

  public async updateInquiryComment(data: any) {
    const dataToUpdate = { 'inquiryStatus.$.remark': data.remark };
    if (data.status == 0) {
      dataToUpdate['inquiryStatus.$.status'] = 0;
    }
    const inquiryComment = await this.Inquiry.findOneAndUpdate(
      { _id: data.id, 'inquiryStatus.stepStatus': data.stepStatus },
      { $set: dataToUpdate },
      { new: true, runValidators: true }
    );

    if (inquiryComment) {
      return inquiryComment;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToUpdate
      );
    }
  }

  public async deleteinquiry(data: any) {
    const inquiryData = await this.Inquiry.findByIdAndDelete({ _id: data.id });
    if (inquiryData) {
      return inquiryData;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToDelete
      );
    }
  }

  public async changeStepStatus(data: any) {
    if (data.inquiryStatus.stepStatus == 'won') {
      await this.Inquiry.findOneAndUpdate(
        { _id: data.id, 'inquiryStatus.stepStatus': 'lost' },
        { $set: { 'inquiryStatus.$.status': 0 } }
      );

      await this.Inquiry.findOneAndUpdate(
        { _id: data.id, 'inquiryStatus.stepStatus': 'contacted' },
        { $set: { 'inquiryStatus.$.status': 1 } }
      );

      await this.Inquiry.findOneAndUpdate(
        { _id: data.id, 'inquiryStatus.stepStatus': 'working' },
        { $set: { 'inquiryStatus.$.status': 1 } }
      );
    }

    if (data.inquiryStatus.stepStatus == 'working') {
      await this.Inquiry.findOneAndUpdate(
        { _id: data.id, 'inquiryStatus.stepStatus': 'contacted' },
        { $set: { 'inquiryStatus.$.status': 1 } }
      );
    }
    // if (data.inquiryStatus.stepStatus == 'lost') {
    //   await this.Inquiry.findOneAndUpdate(
    //     { _id: data.id, 'inquiryStatus.stepStatus': 'won' },
    //     { $set: { 'inquiryStatus.$.status': 0 } }
    //   );
    // }

    const inquiryData = await this.Inquiry.findOneAndUpdate(
      {
        _id: data.id,
        'inquiryStatus.stepStatus': data.inquiryStatus.stepStatus,
      },
      {
        $set: {
          stepStatus: data.inquiryStatus.stepStatus,
          'inquiryStatus.$.status': 1,
          'inquiryStatus.$.remark': data.inquiryStatus.remark,
          'inquiryStatus.$.date': new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (inquiryData) {
      return inquiryData;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToChangeStatus
      );
    }
  }

  public async getAllPartyName(query: any) {
    const allPartyName = await this.Inquiry.find(query).distinct('partyName');
    if (allPartyName) {
      return allPartyName;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToGetData
      );
    }
  }

  public async changeStatus(data: any) {
    const inquiryData = await this.Inquiry.findOneAndUpdate(
      { _id: data.id },
      { status: data.status },
      { new: true, runValidators: true }
    );
    if (inquiryData) {
      return inquiryData;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToChangeStatus
      );
    }
  }

  public async discountOnRequirement(data: any) {
    const addDiscount = await this.Inquiry.findOneAndUpdate(
      { _id: data.id },
      {
        discountOnrequirement: data.discountOnrequirement,
        userComment: data.userComment,
      },
      { new: true, runValidators: true }
    );
    if (addDiscount) {
      return addDiscount;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToSentDiscount
      );
    }
  }

  public async addProductionUserComment(data: any) {
    const addComment = await this.Inquiry.findOneAndUpdate(
      { _id: data.id },
      {
        productionUserComment: data.productionUserComment,
      },
      { new: true, runValidators: true }
    );
    if (addComment) {
      return addComment;
    } else {
      throw new HttpException(
        codes.error.badRequest,
        message.failed.failedToAddComment
      );
    }
  }
}

export default InquiryService;
