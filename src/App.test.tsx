// import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MultiStepForm from './components/MultiStepForm'; // 确保这里的路径正确
import '@testing-library/jest-dom';
describe('MultiStepForm Component Tests', () => {
  test('初始渲染显示选择餐点组件', () => {
    render(<MultiStepForm />);
    expect(screen.getByText(/Please Select a meal/i)).toBeInTheDocument();
  });

  test('允许选择餐点类型并输入人数', () => {
    render(<MultiStepForm />);
    userEvent.selectOptions(screen.getByLabelText(/Please Select a meal/i), 'lunch');
    fireEvent.change(screen.getByLabelText(/Please Enter Number of people/i), { target: { value: '5' } });
    expect((screen.getByLabelText(/Please Enter Number of people/i) as HTMLInputElement).value).toBe('5');
    expect(screen.getByText(/Next/i)).not.toBeDisabled();
  });

  test('选择餐厅后可以导航到选择菜品组件', async () => { // 异步函数
    render(<MultiStepForm />);
    userEvent.selectOptions(screen.getByLabelText(/Please Select a meal/i), 'lunch');
    fireEvent.change(screen.getByLabelText(/Please Enter Number of people/i), { target: { value: '3' } });
    userEvent.click(screen.getByText(/Next/i));
    // 等待选择餐馆的元素出现
    const restaurantSelect = await screen.findByLabelText(/Please Select a Restaurant/i);
    // 这里需要确保你的 'Olive Garden' 选项在 <select> 中是可用的
    userEvent.selectOptions(restaurantSelect, 'Olive Garden');
    userEvent.click(screen.getByText(/Next/i));
    // 等待下一个阶段的内容被渲染
    await waitFor(() => {
      expect(screen.getByText(/Please Select a Dish/i)).toBeInTheDocument();
    });
  });

  test('选择菜品并添加服务量', async () => {
    render(<MultiStepForm />);
    // 导航到选择菜品组件
    userEvent.selectOptions(screen.getByLabelText(/Please Select a meal/i), 'lunch');
    fireEvent.change(screen.getByLabelText(/Please Enter Number of people/i), { target: { value: '3' } });
    userEvent.click(screen.getByText(/Next/i));
    // 等待选择餐馆的元素出现
    const restaurantSelect = await screen.findByLabelText(/Please Select a Restaurant/i);
    // 这里需要确保你的 'Olive Garden' 选项在 <select> 中是可用的
    userEvent.selectOptions(restaurantSelect, 'Olive Garden');
    userEvent.click(screen.getByText(/Next/i));
    // 等待下一个阶段的内容被渲染
    await waitFor(() => {
      expect(screen.getByText(/Please Select a Dish/i)).toBeInTheDocument();
    });
    // 省略之前的步骤代码，假设已经在选择菜品的界面
    const dishSelect = await screen.findByLabelText(/Please Select a Dish/i);
    userEvent.selectOptions(dishSelect, 'Ravioli'); // 假设有 Dish A
    fireEvent.change(screen.getByLabelText(/Please enter no. of servings/i), { target: { value: '2' } });
    const addButton = screen.getByRole('button', { name: /Add/i });
    userEvent.click(addButton);
    const dishQuantityElement = await screen.findByTestId('dish-quantity');
    expect(dishQuantityElement).toHaveTextContent('Ravioli');
    expect(dishQuantityElement).toHaveTextContent('x 2');
  });

  test('总菜品数量应大于或等于人数', async () => {
    render(<MultiStepForm />);
    userEvent.selectOptions(screen.getByLabelText(/Please Select a meal/i), 'lunch');
    fireEvent.change(screen.getByLabelText(/Please Enter Number of people/i), { target: { value: '3' } });
    userEvent.click(screen.getByText(/Next/i));
    // 等待选择餐馆的元素出现
    const restaurantSelect = await screen.findByLabelText(/Please Select a Restaurant/i);
    // 这里需要确保你的 'Olive Garden' 选项在 <select> 中是可用的
    userEvent.selectOptions(restaurantSelect, 'Olive Garden');
    userEvent.click(screen.getByText(/Next/i));
    // 等待下一个阶段的内容被渲染
    await waitFor(() => {
      expect(screen.getByText(/Please Select a Dish/i)).toBeInTheDocument();
    });
    // 省略之前的步骤代码，假设已经在选择菜品的界面
    const dishSelect = await screen.findByLabelText(/Please Select a Dish/i);
    userEvent.selectOptions(dishSelect, 'Ravioli'); // 假设有 Ravioli
    fireEvent.change(screen.getByLabelText(/Please enter no. of servings/i), { target: { value: '2' } });
    const addButton = screen.getByRole('button', { name: /Add/i });
    userEvent.click(addButton);
    const dishQuantityElement = await screen.findByTestId('dish-quantity');
    expect(dishQuantityElement).toHaveTextContent('Ravioli');
    expect(dishQuantityElement).toHaveTextContent('x 2');
    const dishSelect1 = await screen.findByLabelText(/Please Select a Dish/i);
    userEvent.selectOptions(dishSelect1, 'Fettucine Pasta'); // 假设有 Ravioli
    fireEvent.change(screen.getByLabelText(/Please enter no. of servings/i), { target: { value: '1' } });
    await userEvent.click(addButton);
    expect(dishQuantityElement).toHaveTextContent('Fettucine Pasta');
    expect(dishQuantityElement).toHaveTextContent('x 1');
    expect(screen.getByText(/Next/i)).not.toBeDisabled(); // 总份量3，等于人数，应允许进入下一步
  });

  test('最终审核并提交所有选择', async () => {
    render(<MultiStepForm />);
    const logSpy = jest.spyOn(console, 'log');
    userEvent.selectOptions(screen.getByLabelText(/Please Select a meal/i), 'lunch');
    fireEvent.change(screen.getByLabelText(/Please Enter Number of people/i), { target: { value: '3' } });
    userEvent.click(screen.getByText(/Next/i));
    // 等待选择餐馆的元素出现
    const restaurantSelect = await screen.findByLabelText(/Please Select a Restaurant/i);
    // 这里需要确保你的 'Olive Garden' 选项在 <select> 中是可用的
    userEvent.selectOptions(restaurantSelect, 'Olive Garden');
    userEvent.click(screen.getByText(/Next/i));
    // 等待下一个阶段的内容被渲染
    await waitFor(() => {
      expect(screen.getByText(/Please Select a Dish/i)).toBeInTheDocument();
    });
    // 省略之前的步骤代码，假设已经在选择菜品的界面
    const dishSelect = await screen.findByLabelText(/Please Select a Dish/i);
    userEvent.selectOptions(dishSelect, 'Ravioli'); // 假设有 Ravioli
    fireEvent.change(screen.getByLabelText(/Please enter no. of servings/i), { target: { value: '2' } });
    const addButton = screen.getByRole('button', { name: /Add/i });
    userEvent.click(addButton);
    const dishQuantityElement = await screen.findByTestId('dish-quantity');
    expect(dishQuantityElement).toHaveTextContent('Ravioli');
    expect(dishQuantityElement).toHaveTextContent('x 2');
    const dishSelect1 = await screen.findByLabelText(/Please Select a Dish/i);
    userEvent.selectOptions(dishSelect1, 'Fettucine Pasta'); // 假设有 Ravioli
    fireEvent.change(screen.getByLabelText(/Please enter no. of servings/i), { target: { value: '1' } });
    await userEvent.click(addButton);
    expect(dishQuantityElement).toHaveTextContent('Fettucine Pasta');
    expect(dishQuantityElement).toHaveTextContent('x 1');
    expect(screen.getByText(/Next/i)).not.toBeDisabled(); // 总份量3，等于人数，应允许进入下一步
    await userEvent.click(screen.getByText(/Next/i));
    await userEvent.click(screen.getByText(/Submit/i));
    await new Promise(r => setTimeout(r, 0));
    expect(logSpy).toHaveBeenCalledWith(expect.anything());
    logSpy.mockRestore();
  });
  afterEach(() => {
    jest.restoreAllMocks(); // 这将恢复所有mocks到它们原始值
  });
  test('返回修改前一步餐厅选择', async() => {
    render(<MultiStepForm />);
    userEvent.selectOptions(screen.getByLabelText(/Please Select a meal/i), 'lunch');
    fireEvent.change(screen.getByLabelText(/Please Enter Number of people/i), { target: { value: '3' } });
    userEvent.click(screen.getByText(/Next/i));
    // 等待选择餐馆的元素出现
    const restaurantSelect = await screen.findByLabelText(/Please Select a Restaurant/i);
    // 这里需要确保你的 'Olive Garden' 选项在 <select> 中是可用的
    userEvent.selectOptions(restaurantSelect, 'Olive Garden');
    userEvent.click(screen.getByText(/Next/i));
    // 等待下一个阶段的内容被渲染
    await waitFor(() => {
      expect(screen.getByText(/Please Select a Dish/i)).toBeInTheDocument();
    });
    // 省略之前的步骤代码，假设已经在选择菜品的界面
    const dishSelect = await screen.findByLabelText(/Please Select a Dish/i);
    userEvent.selectOptions(dishSelect, 'Ravioli'); // 假设有 Ravioli
    fireEvent.change(screen.getByLabelText(/Please enter no. of servings/i), { target: { value: '2' } });
    const addButton = screen.getByRole('button', { name: /Add/i });
    userEvent.click(addButton);
    const dishQuantityElement = await screen.findByTestId('dish-quantity');
    expect(dishQuantityElement).toHaveTextContent('Ravioli');
    expect(dishQuantityElement).toHaveTextContent('x 2');
    const dishSelect1 = await screen.findByLabelText(/Please Select a Dish/i);
    userEvent.selectOptions(dishSelect1, 'Fettucine Pasta'); // 假设有 Ravioli
    fireEvent.change(screen.getByLabelText(/Please enter no. of servings/i), { target: { value: '1' } });
    await userEvent.click(addButton);
    expect(dishQuantityElement).toHaveTextContent('Fettucine Pasta');
    expect(dishQuantityElement).toHaveTextContent('x 1');
    expect(screen.getByText(/Next/i)).not.toBeDisabled(); // 总份量3，等于人数，应允许进入下一步
    await userEvent.click(screen.getByText(/Next/i));
    await userEvent.click(screen.getByText(/Previous/i)); // 返回选择菜品
    expect(dishQuantityElement).toHaveTextContent('Ravioli');
    expect(dishQuantityElement).toHaveTextContent('x 2');
    await userEvent.click(screen.getByText(/Previous/i)); // 返回选择餐馆
    expect(screen.getByText(/Please Select a Restaurant/i)).toBeInTheDocument();
    userEvent.selectOptions(screen.getByLabelText(/Please Select a Restaurant/i), 'Panda Express');
    await userEvent.click(screen.getByText(/Next/i));
    expect(screen.getByText(/Please Select a Dish/i)).toBeInTheDocument(); // 应刷新菜品列表
  });

  // 更多的测试可以根据实际情况添加
});
