import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { useParams } from 'react-router-dom';
import CampaignDashboard from '../pages/CampaignDashboard';

// GraphQL Query to Fetch Campaign Data
const GET_CAMPAIGN = gql`
  query GetCampaign($campaignId: ID!) {
    campaign(id: $campaignId) {
      _id
      name
      description
      players {
        _id
        player {
          username
        }
        basicInfo {
          name
          race
          class
          level
        }
        private
      }
      milestones
    }
  }
`;

const CampaignDashboardWrapper: React.FC = () => {
  const { campaignId } = useParams<{ campaignId: string }>();

  if (!campaignId) {
    return <div>Error: No campaign ID provided.</div>;
  }

  const { data, loading, error } = useQuery(GET_CAMPAIGN, {
    variables: { campaignId },
    onCompleted: (data) => {
      console.log('Fetched Campaign Data:', data);
    },
    onError: (err) => {
      console.error('Error Fetching Campaign Data:', err);
    },
  });

  const onAddMilestone = (milestone: string) => {
    console.log('Add Milestone:', milestone);
    // TODO: Implement GraphQL mutation to add milestones
  };

  const onRemoveMilestone = (index: number) => {
    console.log('Remove Milestone at index:', index);
    // TODO: Implement GraphQL mutation to remove milestones
  };

  if (loading) return <div>Loading campaign data...</div>;
  if (error) return <div>Error loading campaign: {error.message}</div>;

  const campaign = data?.campaign;

  if (!campaign) {
    return <div>No campaign found for ID: {campaignId}</div>;
  }

  return (
    <CampaignDashboard
      campaign={campaign}
      onAddMilestone={onAddMilestone}
      onRemoveMilestone={onRemoveMilestone}
    />
  );
};

export default CampaignDashboardWrapper;
