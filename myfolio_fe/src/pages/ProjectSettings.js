import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { CloudUpload, Delete, Edit } from '@mui/icons-material';

import SettingsLayout from '../components/layout/SettingsLayout';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { projects } from '../services/api';

const Container = styled.div`
  max-width: 800px;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #6B7280;
  margin-bottom: 2rem;
`;

const ProjectCard = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const ProjectForm = styled.form`
  background-color: white;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ImageUploadSection = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1rem;
`;

const ImagePreview = styled.div`
  width: 200px;
  height: 120px;
  border-radius: 0.5rem;
  background-color: #F3F4F6;
  background-image: ${props => props.image ? `url(${props.image})` : 'none'};
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9CA3AF;
`;

const ImageUploadInfo = styled.div`
  flex: 1;

  h3 {
    font-size: 0.875rem;
    color: ${props => props.theme.colors.text};
    margin-bottom: 0.25rem;
  }

  p {
    font-size: 0.875rem;
    color: #6B7280;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  font-size: 16px;
  outline: none;
  transition: all 0.2s ease-in-out;
  min-height: 100px;
  resize: vertical;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.theme.colors.primary}20;
  }

  &::placeholder {
    color: #9CA3AF;
  }

  ${props => props.error && `
    border-color: ${props.theme.colors.error};
    &:focus {
      border-color: ${props.theme.colors.error};
      box-shadow: 0 0 0 2px ${props.theme.colors.error}20;
    }
  `}
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
`;

const ProjectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.25rem;
  color: ${props => props.theme.colors.text};
`;

const ProjectLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const ProjectLink = styled.a`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  &:hover {
    text-decoration: underline;
  }
`;

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Required'),
  demoUrl: Yup.string()
    .url('Must be a valid URL'),
  repositoryUrl: Yup.string()
    .url('Must be a valid URL'),
  description: Yup.string()
    .required('Required'),
});

const ProjectSettings = () => {
  const [userProjects, setUserProjects] = useState([]);
  const [editingProject, setEditingProject] = useState(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projects.getUserProjects('me');
      console.log('Projects response:', response);
      
      // Handle the response data
      let projectsData = response.data;
      
      // If the data is a string, try to parse it
      if (typeof response.data === 'string') {
        try {
          projectsData = JSON.parse(response.data);
        } catch (e) {
          console.error('Failed to parse projects data:', e);
          projectsData = [];
        }
      }
      
      // Ensure we have an array
      if (!Array.isArray(projectsData)) {
        console.error('Expected array but got:', typeof projectsData, projectsData);
        projectsData = [];
      }
      
      setUserProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setUserProjects([]); // Ensure we set empty array on error
      toast.error(error.response?.data?.message || 'Failed to load projects');
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      demoUrl: '',
      repositoryUrl: '',
      description: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editingProject) {
          await projects.updateProject(editingProject.id, values);
          toast.success('Project updated successfully!');
          setEditingProject(null);
        } else {
          await projects.addProject(values);
          toast.success('Project added successfully!');
        }
        resetForm();
        fetchProjects();
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to save project');
      }
    },
  });

  const handleEdit = (project) => {
    setEditingProject(project);
    formik.setValues({
      name: project.name,
      demoUrl: project.demoUrl || '',
      repositoryUrl: project.repositoryUrl || '',
      description: project.description,
    });
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;

    try {
      await projects.deleteProject(projectId);
      toast.success('Project deleted successfully!');
      fetchProjects();
    } catch (error) {
      toast.error('Failed to delete project');
    }
  };

  return (
    <SettingsLayout>
      <Container>
        <Title>Projects settings</Title>
        <Subtitle>Add and manage your portfolio projects.</Subtitle>

        <ProjectForm onSubmit={formik.handleSubmit}>
          <Input
            label="Project Name"
            placeholder="Enter project name"
            {...formik.getFieldProps('name')}
            error={formik.touched.name && formik.errors.name}
          />

          <Input
            label="Demo URL"
            placeholder="https://example.com"
            {...formik.getFieldProps('demoUrl')}
            error={formik.touched.demoUrl && formik.errors.demoUrl}
          />

          <Input
            label="Repository URL"
            placeholder="https://github.com/username/repo"
            {...formik.getFieldProps('repositoryUrl')}
            error={formik.touched.repositoryUrl && formik.errors.repositoryUrl}
          />

          <div>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '0.5rem' }}>
              Description
            </label>
            <TextArea
              id="description"
              placeholder="Write a description of your project..."
              {...formik.getFieldProps('description')}
              error={formik.touched.description && formik.errors.description}
            />
            {formik.touched.description && formik.errors.description && (
              <div style={{ color: 'red', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                {formik.errors.description}
              </div>
            )}
          </div>

          <ButtonGroup>
            <Button type="submit">
              {editingProject ? 'Update Project' : 'Add Project'}
            </Button>
            {editingProject && (
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  setEditingProject(null);
                  formik.resetForm();
                }}
              >
                Cancel
              </Button>
            )}
          </ButtonGroup>
        </ProjectForm>

        <ProjectList>
          {userProjects.map((project) => (
            <ProjectCard key={project.id}>
              <ProjectHeader>
                <ProjectTitle>{project.name}</ProjectTitle>
                <ButtonGroup>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => handleEdit(project)}
                  >
                    <Edit /> Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => handleDelete(project.id)}
                  >
                    <Delete /> Remove
                  </Button>
                </ButtonGroup>
              </ProjectHeader>
              <p>{project.description}</p>
              <ProjectLinks>
                {project.demoUrl && (
                  <ProjectLink href={project.demoUrl} target="_blank" rel="noopener noreferrer">
                    Demo URL
                  </ProjectLink>
                )}
                {project.repositoryUrl && (
                  <ProjectLink href={project.repositoryUrl} target="_blank" rel="noopener noreferrer">
                    Repository URL
                  </ProjectLink>
                )}
              </ProjectLinks>
            </ProjectCard>
          ))}
        </ProjectList>
      </Container>
    </SettingsLayout>
  );
};

export default ProjectSettings; 